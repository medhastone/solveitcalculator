import re
import sys

def convert_html_to_jsx(html_str):
    # Basic conversions
    jsx = html_str
    jsx = re.sub(r'class=', 'className=', jsx)
    jsx = re.sub(r'for=', 'htmlFor=', jsx)
    jsx = re.sub(r'onclick=', 'onClick=', jsx)
    jsx = re.sub(r'onchange=', 'onChange=', jsx)
    jsx = re.sub(r'onkeyup=', 'onKeyUp=', jsx)
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)
    
    # Self-closing tags
    jsx = re.sub(r'<input([^>]*[^/])>', r'<input\1 />', jsx)
    jsx = re.sub(r'<img([^>]*[^/])>', r'<img\1 />', jsx)
    jsx = re.sub(r'<br>', r'<br />', jsx)
    jsx = re.sub(r'<hr>', r'<hr />', jsx)
    
    # Style attributes
    jsx = re.sub(r'style=""', '', jsx)
    
    # Other specific React fixes
    jsx = re.sub(r'selected=""', 'defaultValue="1"', jsx) # Actually React uses defaultValue or value on select
    jsx = re.sub(r'<select([^>]*)>', r'<select\1>', jsx)

    # Clean up attributes
    jsx = jsx.replace('selected=""', '')
    jsx = jsx.replace('selected', '')

    return jsx

# We will paste the HTML into a file called raw_gram.html
