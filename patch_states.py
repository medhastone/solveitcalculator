import re

with open('app/investing-and-growth/InvestingAndGrowthClient.tsx', 'r') as f:
    code = f.read()

states = """
  const [activeTab, setActiveTab] = useState('all');
  const [currentPrincipal, setCurrentPrincipal] = useState(10000);
  const [currentMonthly, setCurrentMonthly] = useState(500);
  const [currentRate, setCurrentRate] = useState(7);
  const [currentYears, setCurrentYears] = useState(10);
  const [isInflation, setIsInflation] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(1000000);
  
  const calcFv = (p, m, r, y) => {
    let fv = p * Math.pow(1 + r/12, y*12);
    for(let i=0; i<y*12; i++) {
        fv += m * Math.pow(1 + r/12, i);
    }
    return fv;
  };
  
  const activeCount = activeTab === 'all' ? 95 : 10; // rough approximation
  const totalDeposits = currentPrincipal + (currentMonthly * 12 * currentYears);
  
  const fvNominal = calcFv(currentPrincipal, currentMonthly, currentRate/100, currentYears);
  const totalInterest = fvNominal - totalDeposits;
  const realFv = isInflation ? fvNominal / Math.pow(1.03, currentYears) : fvNominal;
  const displayVal = fvNominal;
  
  const formatCompact = (num) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };
  
  const contribScale = 50;
  const scaleFactor = 30;

"""

code = code.replace("const [searchQuery, setSearchQuery] = useState('');", "const [searchQuery, setSearchQuery] = useState('');\n" + states)

with open('app/investing-and-growth/InvestingAndGrowthClient.tsx', 'w') as f:
    f.write(code)
