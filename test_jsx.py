import re

def parse_html(html):
    # This will simulate how `convert_full_html.py` runs
    html_str = re.sub(r'<(img|input|br|hr)([^>]*?)(?<!/)>', r'<\1\2 />', html)
    html_str = html_str.replace(' class="', ' className="')
    html_str = html_str.replace(' for="', ' htmlFor="')
    html_str = html_str.replace(' value="', ' defaultValue="')
    html_str = html_str.replace(' readonly=""', ' readOnly')
    html_str = html_str.replace(' readonly', ' readOnly')
    html_str = re.sub(r'style="width: ([\d.]+)%;"', r'style={{width: "\1%"}}', html_str)
    html_str = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', html_str)
    html_str = re.sub(r'<script type="application/ld\+json">.*?</script>', '', html_str, flags=re.DOTALL)
    html_str = re.sub(r'<script>.*?</script>', '', html_str, flags=re.DOTALL)
    return html_str

with open('/tmp/daily_wage.html', 'r') as f:
    html = f.read()

main_match = re.search(r'<main.*?</main>', html, flags=re.DOTALL)
if main_match:
    main_jsx = parse_html(main_match.group(0))
    print("Found FEATURED SNIPPET in main_jsx:", "FEATURED SNIPPET" in main_jsx)
else:
    print("Main not found")
