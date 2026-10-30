import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { bn } from '../../../../i18n/messages/bn';
import { AddressFields } from './AddressFields';

describe('AddressFields', () => {
  it('renders Bangla names while submitting the original division and district values', () => {
    const html = renderToStaticMarkup(
      <AddressFields
        value={{
          recipientName: '',
          phone: '',
          division: 'Dhaka',
          district: 'Tangail',
          upazila: '',
          area: '',
          addressLine: '',
        }}
        onChange={() => {}}
        copy={bn.checkout}
        locale="bn"
      />,
    );

    expect(html).toContain('value="Dhaka" selected="">ঢাকা</option>');
    expect(html).toContain('value="Tangail" selected="">টাঙ্গাইল</option>');
  });
});
