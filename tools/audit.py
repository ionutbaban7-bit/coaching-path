#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audit complet al proiectului: structură, legături, traduceri, scripturi, date."""
import re, os, glob, html.parser
from collections import Counter

PAGES = sorted(glob.glob('*.html'))
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr'}

def line(s): print(s)
def head(t): print("\n" + t)

head("="*72); print("AUDIT COMPLET — Coaching Learning Path"); print("="*72)

# ---------- 1. STRUCTURĂ HTML ----------
class V(html.parser.HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.st=[]; s.err=[]
    def handle_starttag(s,t,a):
        if t not in VOID: s.st.append((t,s.getpos()[0]))
    def handle_endtag(s,t):
        if t in VOID: return
        if not s.st: s.err.append(f"linia {s.getpos()[0]}: </{t}> fără deschidere"); return
        if s.st[-1][0]==t: s.st.pop()
        else:
            for i in range(len(s.st)-1,-1,-1):
                if s.st[i][0]==t:
                    for j in range(len(s.st)-1,i-1,-1):
                        s.err.append(f"linia {s.st[j][1]}: <{s.st[j][0]}> neînchis (găsit </{t}> la {s.getpos()[0]})")
                    del s.st[i:]; return
            s.err.append(f"linia {s.getpos()[0]}: </{t}> fără deschidere")

head("[1] STRUCTURĂ HTML")
bad=0
for f in PAGES:
    v=V(); v.feed(open(f,encoding='utf-8').read())
    if v.err or v.st:
        bad+=1; print(f"  [X] {f}")
        for e in v.err[:6]: print("      ", e)
        for t,l in v.st[:6]: print(f"       linia {l}: <{t}> rămas deschis")
    else: print(f"  [ok] {f}")
if not bad: print("  -> toate paginile au structura echilibrata")

# ---------- 2. LEGĂTURI ȘI RESURSE ----------
head("[2] LEGĂTURI ȘI RESURSE")
prob=[]
for f in PAGES:
    s=open(f,encoding='utf-8').read()
    for m in re.finditer(r'(?:href|src)="([^"]+)"', s):
        r=m.group(1)
        if r.startswith(('http','mailto:','data:','//','#')): continue
        target=r.split('#')[0]
        if not target: continue
        if not os.path.exists(target): prob.append((f,r,'FISIER LIPSA'))
        elif target.endswith('.html') and '#' in r:
            if f'id="{r.split("#")[1]}"' not in open(target,encoding='utf-8').read():
                prob.append((f,r,'ANCORA LIPSA'))
if prob:
    for f,r,w in prob: print(f"  [X] {f}: {r} -> {w}")
else: print("  [ok] toate legaturile interne si resursele exista")

# ---------- 3. ID-URI DUPLICATE ----------
head("[3] ID-URI DUPLICATE")
for f in PAGES:
    ids=re.findall(r'\sid="([^"]+)"', open(f,encoding='utf-8').read())
    dup=[k for k,v in Counter(ids).items() if v>1]
    print(f"  [{'X' if dup else 'ok'}] {f}" + (f" -> {dup}" if dup else ""))

# ---------- 4. TRADUCERI + RESTANȚE ----------
head("[4] TRADUCERI SI TEXT-URI RAMASE DE COMPLETAT")
for f in PAGES:
    s=open(f,encoding='utf-8').read()
    ro=len(re.findall(r'data-i18n-ro=',s)); en=len(re.findall(r'data-i18n-en=',s))
    restante=[w for w in ['TODO','TBD','Lorem','lorem','XXX'] if w in s]
    print(f"  [{'ok' if ro==en else 'X'}] {f:16} ro={ro} en={en}" + (f"  ATENTIE: {restante}" if restante else ""))

# ---------- 5. BENZI DE VERIFICARE ----------
head("[5] BENZILE DE VERIFICARE (data-verify)")
TOPICS={'systems','paths','transitions','credentials','schools','costs','journey','faq'}
for f in PAGES:
    s=open(f,encoding='utf-8').read()
    strips=re.findall(r'<div data-verify="([^"]+)"', s)
    if not strips:
        print(f"  [--] {f:16} nicio banda" + ("" if f=='legal.html' else "  (POSIBILA PROBLEMA)"))
        continue
    wrong=[]
    for t in strips:
        i=s.index(f'data-verify="{t}"')
        secs=re.findall(r'<section[^>]*id="([^"]+)"', s[:i])
        insec=secs[-1] if secs else None
        if t in TOPICS and insec!=t: wrong.append(f"{t}->in #{insec}")
    print(f"  [{'X' if wrong else 'ok'}] {f:16} {len(strips)}: {', '.join(strips)}" + (f"  PLASARE: {wrong}" if wrong else ""))

# ---------- 6. SCRIPTURI ----------
head("[6] SCRIPTURI PE PAGINI")
for f in PAGES:
    s=open(f,encoding='utf-8').read()
    js=re.findall(r'<script src="(assets/js/[^"]+)"', s)
    missing=[j for j in js if not os.path.exists(j)]
    print(f"  [{'X' if missing else 'ok'}] {f:16} {', '.join(x.split('/')[-1] for x in js)}" + (f" LIPSA:{missing}" if missing else ""))

# ---------- 7. SINTAXĂ JS ----------
head("[7] SINTAXA JS (node --check)")
os.system('for f in assets/js/*.js tools/*.mjs server.js; do node --check "$f" >/dev/null 2>&1 && echo "  [ok] $f" || echo "  [X] $f"; done')

# ---------- 8. TABELE DE STARE ----------
head("[8] TABELE DE STARE — elemente nefinalizate")
for f in ['individual.html','echipa.html']:
    s=open(f,encoding='utf-8').read()
    rows=re.findall(r'<tr>\s*<td[^>]*>(.*?)</td>.*?<span class="tag ([a-z-]+)"[^>]*>(.*?)</span>', s, re.S)
    pend=[(re.sub(r'<[^>]+>','',a).strip()[:44], b.strip()) for a,c,b in rows if c in ('gray','warn','todo')]
    print(f"  {f}: {len(pend)} elemente nefinalizate")
    for a,b in pend[:14]: print(f"     [{c if False else ''}{b}] {a}")

# ---------- 9. CONȚINUT GENERAT (plan.js) ----------
head("[9] CONTINUTUL GENERAT DE plan.js")
plan=open('assets/js/plan.js',encoding='utf-8').read()
def cnt(needle): return plan.count(needle)
print(f"  categorii de intrebari:      {cnt(chr(10)+'      id:')}")
print(f"  intrebari in banca (1:1):    {cnt(chr(10)+'        [')}")
print(f"  intrebari interviu echipa:   {cnt(chr(10)+'    [')}")
print("  ateliere (id-uri ws):       ", cnt(chr(10)+"      n:"))
print(f"  dimensiuni chestionar:       {cnt(chr(10)+'      d:')}")
print(f"  itemi chestionar:            {cnt(chr(39)+'it_ro'+chr(39))}")
print(f"  randuri grila observatie:    {cnt(chr(10)+'    {')}")

# ---------- 10. FIȘIERE DE DEPLOY ----------
head("[10] FISIERE DE DEPLOY")
for f in ['render.yaml','package.json','server.js','404.html','data/sources.json',
          'tools/update-info.mjs','.github/workflows/update-info.yml','CHANGELOG.md','legal.html']:
    print(f"  [{'ok' if os.path.exists(f) else 'X'}] {f:44} {os.path.getsize(f) if os.path.exists(f) else 0} bytes")
