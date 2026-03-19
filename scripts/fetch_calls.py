#!/usr/bin/env python3
"""
Fetch all open + forthcoming EU grant calls from the SEDIA Search API
and write them to data/calls.json.

Usage:
    python3 scripts/fetch_calls.py
"""

import urllib.request, urllib.parse, json, uuid, math, time, re, sys, os
import datetime
from collections import Counter
from pathlib import Path

API_URL = "https://api.tech.ec.europa.eu/search-api/prod/rest/search"

QUERY = {
    "bool": {
        "must": [
            {"terms": {"type": ["1", "2", "8"]}},
            {"terms": {"status": ["31094501", "31094502"]}}
        ]
    }
}
SORT = {"field": "startDate", "order": "DESC"}

PROGRAMME_NAMES = {
    "43108390": "Horizon Europe", "43152860": "Digital Europe",
    "44181033": "European Defence Fund", "43353764": "Erasmus+",
    "43251814": "Creative Europe", "43251589": "CERV",
    "43252476": "Single Market Programme", "43252405": "LIFE",
    "43298916": "Euratom", "43332642": "EU4Health",
    "43251567": "Connecting Europe Facility", "43089234": "Innovation Fund",
    "43392145": "EMFAF", "43254019": "ESF+",
    "43254037": "European Solidarity Corps", "43253979": "Customs Programme",
    "43253995": "Fiscalis", "43251447": "AMIF",
    "43251530": "BMVI", "43251534": "CCEI",
    "43298203": "UCPM", "43252368": "ISF",
    "43252386": "Justice", "44416173": "Interregional Innovation",
    "45876777": "NDICI Global Europe", "43298664": "AGRIP",
    "43253706": "TSI", "43251882": "IMCAP",
    "43252449": "RFCS", "43252517": "SOCPL",
    "44773133": "IMREG", "44773066": "JTM", "31045243": "Horizon 2020",
    "45532249": "EU Agencies", "43252433": "Pericles IV",
    "42810547": "Europe Direct", "43697167": "European Parliament",
    "43253967": "Renewable Energy FM", "43251842": "EU Anti-Fraud (EUAF)",
    "111111": "NDICI Global Europe", "43637601": "Pilot Projects & Preparatory Actions",
}

STATUS_MAP = {"31094501": "forthcoming", "31094502": "open", "31094503": "closed"}


def build_multipart(fields, boundary):
    body = b""
    for name, (fn, data, ct) in fields.items():
        body += f"--{boundary}\r\n".encode()
        body += f'Content-Disposition: form-data; name="{name}"; filename="{fn}"\r\n'.encode()
        body += f"Content-Type: {ct}\r\n\r\n".encode()
        body += data.encode() if isinstance(data, str) else data
        body += b"\r\n"
    body += f"--{boundary}--\r\n".encode()
    return body


def fetch_page(page_num, page_size=100, retries=3):
    for attempt in range(retries):
        try:
            boundary = uuid.uuid4().hex
            params = urllib.parse.urlencode({
                "apiKey": "SEDIA", "text": "***",
                "pageSize": str(page_size), "pageNumber": str(page_num),
            })
            fields = {
                "query": ("blob", json.dumps(QUERY), "application/json"),
                "sort": ("blob", json.dumps(SORT), "application/json"),
                "languages": ("blob", json.dumps(["en"]), "application/json"),
            }
            body = build_multipart(fields, boundary)
            req = urllib.request.Request(f"{API_URL}?{params}", data=body, method="POST")
            req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}", file=sys.stderr)
            if attempt < retries - 1:
                time.sleep(2 * (attempt + 1))
    return {"results": []}


def parse_action_type(toa):
    if not toa:
        return ""
    if "RIA" in toa or "Research and Innovation" in toa:
        return "RIA"
    if "Innovation Action" in toa and "Research" not in toa:
        return "IA"
    if "CSA" in toa or "Coordination and Support" in toa:
        return "CSA"
    if "PPI" in toa or "Pre-Commercial" in toa:
        return "PPI"
    if any(x in toa.lower() for x in ["cofund", "co-fund"]):
        return "CoFund"
    if "Prize" in toa or "PRIZE" in toa:
        return "Prize"
    if "MSCA" in toa and "SE" in toa:
        return "MSCA-SE"
    if "MSCA" in toa:
        return "MSCA"
    if "Lump Sum" in toa or "lump" in toa.lower():
        return "Grant"
    if "Grant" in toa:
        return "Grant"
    return toa.split()[0] if toa else ""


def normalize_date(d):
    if not d:
        return ""
    if "T" in d:
        d = d.split("T")[0]
    if re.match(r"^\d{4}-\d{2}-\d{2}$", d):
        return d
    for fmt in ["%d %B %Y", "%d %b %Y", "%B %d, %Y"]:
        try:
            return datetime.datetime.strptime(d.strip(), fmt).strftime("%Y-%m-%d")
        except ValueError:
            pass
    return d


def main():
    project_root = Path(__file__).resolve().parent.parent
    output_path = project_root / "data" / "calls.json"

    print("Fetching page 1...", flush=True)
    data = fetch_page(1)
    total = data.get("totalResults", 0)
    print(f"Total calls: {total}", flush=True)
    num_pages = math.ceil(total / 100)

    all_results = data.get("results", [])
    print(f"Page 1: {len(all_results)} results", flush=True)

    for page in range(2, num_pages + 1):
        time.sleep(0.5)
        print(f"Fetching page {page}/{num_pages}...", flush=True)
        pdata = fetch_page(page)
        results = pdata.get("results", [])
        all_results.extend(results)
        print(f"  Got {len(results)}, total so far: {len(all_results)}", flush=True)

    print(f"\nFetched {len(all_results)} raw results", flush=True)

    calls = []
    for r in all_results:
        m = r.get("metadata", {})
        identifier = (m.get("identifier") or [""])[0]
        title = (m.get("title") or [r.get("content", "")])[0]
        status_id = (m.get("status") or [""])[0]

        actions_str = (m.get("actions") or ["[]"])[0]
        action_type, stage, deadline = "", "single", ""
        try:
            actions = json.loads(actions_str)
            if actions:
                act = actions[0]
                types = act.get("types", [])
                if types:
                    action_type = parse_action_type(types[0].get("typeOfAction", ""))
                proc = act.get("submissionProcedure", {}).get("abbreviation", "")
                if "two" in proc.lower():
                    stage = "two-stage"
                dls = act.get("deadlineDates", [])
                if dls:
                    deadline = dls[-1]
        except (json.JSONDecodeError, KeyError):
            pass

        if not deadline:
            dl = (m.get("deadlineDate") or [""])[0]
            if dl:
                deadline = dl
        deadline = normalize_date(deadline)

        fp_ids = m.get("frameworkProgramme") or []
        programme, programme_id = "", ""
        for fp in fp_ids:
            if fp in PROGRAMME_NAMES:
                programme, programme_id = PROGRAMME_NAMES[fp], fp
                break
        if not programme and fp_ids:
            programme_id = fp_ids[0]
            programme = f"EU Programme ({programme_id})"

        cluster = ""
        if identifier.startswith("HORIZON-"):
            parts = identifier.split("-")
            if len(parts) >= 2:
                tag = parts[1]
                cl_map = {
                    "HLTH": "CL1", "CL1": "CL1", "CL2": "CL2", "CL3": "CL3",
                    "CL4": "CL4", "CL5": "CL5", "CL6": "CL6", "MSCA": "MSCA",
                    "ERC": "ERC", "EIC": "EIC", "EIE": "EIE", "WIDERA": "WIDERA",
                    "INFRA": "INFRA", "JU": "JU", "MISS": "MISS",
                }
                cluster = cl_map.get(tag, tag if tag.startswith("CL") else "")

        kw = m.get("keywords") or []

        calls.append({
            "topicId": identifier,
            "title": title,
            "programme": programme,
            "programmeId": programme_id,
            "cluster": cluster,
            "callIdentifier": (m.get("callIdentifier") or [""])[0],
            "actionType": action_type,
            "deadline": deadline,
            "stage": stage,
            "callStatus": STATUS_MAP.get(status_id, "unknown"),
            "keywords": ", ".join(kw[:10]) if kw else "",
            "portalUrl": f"https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/{identifier.lower()}",
        })

    today_str = datetime.date.today().isoformat()
    before = len(calls)
    calls = [c for c in calls if not (
        c["callStatus"] == "open" and c.get("deadline") and c["deadline"] < today_str
    )]
    if before != len(calls):
        print(f"\nRemoved {before - len(calls)} calls marked 'open' with past deadlines")

    calls.sort(key=lambda c: c.get("deadline") or "9999-99-99")

    print(f"\nTotal calls: {len(calls)}")
    for p, cnt in Counter(c["programme"] for c in calls).most_common(10):
        print(f"  {p}: {cnt}")
    print(f"\nBy status:")
    for s, cnt in Counter(c["callStatus"] for c in calls).items():
        print(f"  {s}: {cnt}")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(calls, f, separators=(",", ":"), ensure_ascii=False)
    size_kb = output_path.stat().st_size / 1024
    print(f"\nWritten {output_path} ({len(calls)} calls, {size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
