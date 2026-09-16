with open('app/daily-wage-calculator/page.tsx', 'r') as f:
    content = f.read()

# I will replace `<DailyWageClient />;` with `<DailyWageClient />` or `<><DailyWageClient /></>` or wrap it properly.
content = content.replace("<DailyWageClient />;", "<DailyWageClient />\n    </>")

# I should also make sure it returns a fragment.
if "return (" in content and "<>" not in content.split("return (")[1][:20]:
    content = content.replace("return (", "return (\n    <>")

with open('app/daily-wage-calculator/page.tsx', 'w') as f:
    f.write(content)
