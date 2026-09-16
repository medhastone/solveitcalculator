with open("app/conversion/gram-to-cup/GramToCupClient.tsx", "r") as f:
    content = f.read()

content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport Header from '@/components/Header';\nimport Footer from '@/components/Footer';")

content = content.replace("return (\n    <>", "return (\n    <div className=\"min-h-screen flex flex-col bg-surface text-on-surface\">\n      <Header />\n      <main className=\"w-full pt-16 bg-surface flex-1\">")

content = content.replace("</section>\n    </>", "</section>\n      </main>\n      <Footer />\n    </div>")

with open("app/conversion/gram-to-cup/GramToCupClient.tsx", "w") as f:
    f.write(content)

