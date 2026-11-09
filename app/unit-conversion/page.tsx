import { permanentRedirect } from 'next/navigation';

export default function UnitConversionRedirectPage() {
  permanentRedirect('/conversions');
}
