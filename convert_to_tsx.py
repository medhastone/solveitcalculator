import re

with open('/tmp/daily_wage.html', 'r') as f:
    html = f.read()

# find main tags
match = re.search(r'(<main.*?>.*?</main>)', html, re.DOTALL)
if match:
    main_content = match.group(1)
else:
    main_content = html

# Basic JSX conversions
jsx = main_content
jsx = jsx.replace('class="', 'className="')
jsx = jsx.replace('for="', 'htmlFor="')
jsx = jsx.replace('readonly=""', 'readOnly')
jsx = jsx.replace('checked=""', 'defaultChecked')
jsx = jsx.replace('disabled=""', 'disabled')
jsx = jsx.replace('selected=""', 'defaultValue')

# Close self-closing tags
def close_tag(match):
    tag = match.group(0)
    if not tag.endswith('/>'):
        return tag[:-1] + ' />'
    return tag

jsx = re.sub(r'<(input|img|br|hr|meta|link)[^>]*>', close_tag, jsx)

# Convert style attributes
def style_to_object(match):
    style_str = match.group(1)
    # This is a rudimentary converter and might fail on complex styles
    # We will just strip styles for now to avoid errors, or try to convert simple ones.
    styles = {}
    for rule in style_str.split(';'):
        if ':' in rule:
            key, val = rule.split(':', 1)
            key = key.strip()
            # camel case
            parts = key.split('-')
            key = parts[0] + ''.join(x.title() for x in parts[1:])
            val = val.strip().replace('"', "'")
            styles[key] = val
    
    style_obj_str = ", ".join(f"'{k}': '{v}'" for k, v in styles.items())
    return f"style={{{{{style_obj_str}}}}}"

jsx = re.sub(r'style="([^"]*)"', style_to_object, jsx)

# Comments
jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write("""'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Calendar, Clock, DollarSign, RefreshCw, FileText, Download } from 'lucide-react';

export default function DailyWageClient() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/salary-and-payroll" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-indigo-600" />
              Daily Wage Calculator
            </h1>
          </div>
        </div>
      </header>
      """)
    f.write(jsx)
    f.write("""
    </div>
  );
}
""")
