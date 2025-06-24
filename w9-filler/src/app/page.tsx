// src/app/page.tsx
'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Checkbox,
} from '@mui/material';

export default function W9Form() {
  const [form, setForm] = useState({
    name: '',
    businessName: '',
    taxClass: '',
    exemption: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    requester: '',
    ssn1: '',
    ssn2: '',
    ssn3: '',
    ein: '',
    date: '',
    disclosureApplicable: false,
  });

  const handleChange = (key: string) => (e: any) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleCheckboxChange = (e: any) => {
    setForm({ ...form, disclosureApplicable: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/fill-w9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
  
    if (!res.ok) {
      alert('Failed to generate PDF.');
      return;
    }
  
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank'); // 👈 open PDF in a new browser tab
  };
  

  const isIndividual = form.taxClass === 'Individual/sole proprietor';

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Fill W‑9 Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="1. Name" fullWidth required value={form.name} onChange={handleChange('name')} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="2. Business Name / Disregarded Entity" fullWidth value={form.businessName} onChange={handleChange('businessName')} />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>3a. Federal Tax Classification</FormLabel>
                <RadioGroup row value={form.taxClass} onChange={handleChange('taxClass')}>
                  {['Individual/sole proprietor', 'C Corporation', 'S Corporation', 'Partnership', 'Trust/estate', 'LLC'].map((opt) => (
                    <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
            {['Partnership', 'Trust/estate', 'LLC'].includes(form.taxClass) && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={form.disclosureApplicable} onChange={handleCheckboxChange} />}
                  label="3b. I have foreign partners, owners, or beneficiaries (check if applicable)"
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField label="4. Exemptions (if any)" fullWidth value={form.exemption} onChange={handleChange('exemption')} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="5. Address" fullWidth required value={form.address} onChange={handleChange('address')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="City" fullWidth required value={form.city} onChange={handleChange('city')} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField label="State" fullWidth required value={form.state} onChange={handleChange('state')} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField label="ZIP Code" fullWidth required value={form.zip} onChange={handleChange('zip')} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="7. List Account (optional)" fullWidth value={form.requester} onChange={handleChange('requester')} />
            </Grid>

            {/* TIN Section */}
            <Grid item xs={12}>
              <Typography variant="h6">Part I – Taxpayer Identification Number (TIN)</Typography>
            </Grid>
            {isIndividual ? (
              <>
                <Grid item xs={4}>
                  <TextField label="SSN - XXX" value={form.ssn1} onChange={handleChange('ssn1')} fullWidth required />
                </Grid>
                <Grid item xs={4}>
                  <TextField label="SSN - XX" value={form.ssn2} onChange={handleChange('ssn2')} fullWidth required />
                </Grid>
                <Grid item xs={4}>
                  <TextField label="SSN - XXXX" value={form.ssn3} onChange={handleChange('ssn3')} fullWidth required />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <TextField label="Employer Identification Number (EIN)" fullWidth value={form.ein} onChange={handleChange('ein')} required />
              </Grid>
            )}

            <Grid item xs={12} md={4}>
              <TextField label="Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange('date')} />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Generate W‑9 PDF
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}








// // src/app/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   Container,
//   Typography,
//   Grid,
//   TextField,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Button,
//   Box,
//   Checkbox,
// } from '@mui/material';

// export default function W9Form() {
//   const [form, setForm] = useState({
//     name: '',
//     businessName: '',
//     taxClass: '',
//     exemption: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     requester: '',
//     ssn1: '',
//     ssn2: '',
//     ssn3: '',
//     ein: '',
//     date: '',
//     disclosureApplicable: false,
//   });

//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   const handleChange = (key: string) => (e: any) => {
//     const updatedForm = { ...form, [key]: e.target.value };
//     setForm(updatedForm);
//   };

//   const handleCheckboxChange = (e: any) => {
//     const updatedForm = { ...form, disclosureApplicable: e.target.checked };
//     setForm(updatedForm);
//   };

//   useEffect(() => {
//     const generatePreview = async () => {
//       const res = await fetch('/api/fill-w9', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) return;

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       setPdfUrl(url);
//     };

//     generatePreview();
//   }, [form]);

//   const isIndividual = form.taxClass === 'Individual/sole proprietor';

//   return (
//     <Container maxWidth="md">
//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Fill W‑9 Form
//         </Typography>
//         <form>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField label="1. Name" fullWidth required value={form.name} onChange={handleChange('name')} />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField label="2. Business Name / Disregarded Entity" fullWidth value="sdfsdfsdf sdfsdf" onChange={handleChange('businessName')} />
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl component="fieldset">
//                 <FormLabel>3a. Federal Tax Classification</FormLabel>
//                 <RadioGroup row value={form.taxClass} onChange={handleChange('taxClass')}>
//                   {['Individual/sole proprietor', 'C Corporation', 'S Corporation', 'Partnership', 'Trust/estate', 'LLC'].map((opt) => (
//                     <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
//                   ))}
//                 </RadioGroup>
//               </FormControl>
//             </Grid>
//             {['Partnership', 'Trust/estate', 'LLC'].includes(form.taxClass) && (
//               <Grid item xs={12}>
//                 <FormControlLabel
//                   control={<Checkbox checked={form.disclosureApplicable} onChange={handleCheckboxChange} />}
//                   label="3b. I have foreign partners, owners, or beneficiaries (check if applicable)"
//                 />
//               </Grid>
//             )}
//             <Grid item xs={12} md={6}>
//               <TextField label="4. Exemptions (if any)" fullWidth value={form.exemption} onChange={handleChange('exemption')} />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField label="5. Address" fullWidth required value={form.address} onChange={handleChange('address')} />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField label="City" fullWidth required value={form.city} onChange={handleChange('city')} />
//             </Grid>
//             <Grid item xs={6} md={4}>
//               <TextField label="State" fullWidth required value={form.state} onChange={handleChange('state')} />
//             </Grid>
//             <Grid item xs={6} md={4}>
//               <TextField label="ZIP Code" fullWidth required value={form.zip} onChange={handleChange('zip')} />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField label="7. Requester (optional)" fullWidth value={form.requester} onChange={handleChange('requester')} />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6">Part I – Taxpayer Identification Number (TIN)</Typography>
//             </Grid>
//             {isIndividual ? (
//               <>
//                 <Grid item xs={4}>
//                   <TextField label="SSN - XXX" value={form.ssn1} onChange={handleChange('ssn1')} fullWidth required />
//                 </Grid>
//                 <Grid item xs={4}>
//                   <TextField label="SSN - XX" value={form.ssn2} onChange={handleChange('ssn2')} fullWidth required />
//                 </Grid>
//                 <Grid item xs={4}>
//                   <TextField label="SSN - XXXX" value={form.ssn3} onChange={handleChange('ssn3')} fullWidth required />
//                 </Grid>
//               </>
//             ) : (
//               <Grid item xs={12}>
//                 <TextField label="Employer Identification Number (EIN)" fullWidth value={form.ein} onChange={handleChange('ein')} required />
//               </Grid>
//             )}

//             <Grid item xs={12} md={4}>
//               <TextField label="Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange('date')} />
//             </Grid>
//           </Grid>
//         </form>

        {/* {pdfUrl && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Live PDF Preview</Typography>
            <iframe src={pdfUrl} width="100%" height="700px" style={{ border: '1px solid #ccc' }} />
          </Box>
        )} */}
//       </Box>
//     </Container>
//   );
// }
