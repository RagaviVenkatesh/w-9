import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const form = await req.json();
  const {
    name, businessName, taxClass, exemption, address,
    city, state, zip, requester, ssn1, ssn2, ssn3, ein, date,
    disclosureApplicable
  } = form;

  const pdfPath = path.join(process.cwd(), 'public', 'fw9.pdf');
  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const draw = (text: string, x: number, y: number) => {
    if (text) {
      page.drawText(text, { x, y, size: 10, font });
    }
  };

  draw(name, 73, 664);
  draw(businessName, 73, 640);
  draw(exemption, 544, 591);
  draw(address, 73, 497);
  draw(`${city}, ${state},${zip}`, 73, 474 );
//   draw(zip, 300, 588)        ;
  draw(requester, 73, 450);
  draw(date, 410, 195);

//   if (taxClass === 'Individual/sole proprietor') {
//     draw(ssn1, 112, 460);
//     draw(ssn2, 160, 460);
//     draw(ssn3, 195, 460);
//   } 
if (taxClass === 'Individual/sole proprietor') {
    const ssnFull = `${ssn1}${ssn2}${ssn3}`.padEnd(9, ' '); // Ensure at least 9 characters
  
    const startX = 420;
    const y = 404;
    const charSpacing = 16; // Adjust spacing as needed
  
    for (let i = 0; i < 9; i++) {
      const x = startX + i * charSpacing + (i >= 3 ? 10 : 0) + (i >= 5 ? 10 : 0); // Add extra spacing for dashes
      const char = ssnFull[i] || '';
      draw(char, x, y);
    }
  
    // Optionally draw dashes
    draw('-', startX + 3 * charSpacing, y);
    draw('-', startX + 5 * charSpacing + 10, y);
  }
  
  else {
        const einFull = ein.padEnd(9, ' '); // Ensure at least 9 characters
      
        const startX = 422;
        const y = 356;
        const charSpacing = 15.2;
      
        for (let i = 0; i < 9; i++) {
          const x = startX + i * charSpacing + (i >= 2 ? 10 : 0); // Extra spacing after 2nd digit for dash
          const char = einFull[i] || ' ';
          draw(char, x, y);
        }
      
        // Draw dash between 2nd and 3rd digit
        draw('', startX + 2 * charSpacing, y);
      
      
  }

  const taxCheckPositions: Record<string, { x: number; y: number }> = {
    'Individual/sole proprietor': { x: 73, y: 603 },
    'C Corporation': { x: 180, y: 604 },
    'S Corporation': { x: 252, y: 604 },
    'Partnership': { x: 324, y: 604 },
    'Trust/estate': { x: 389, y: 604 },
    'LLC': { x: 73, y: 590 },
  };

  const selected = taxCheckPositions[taxClass];
  if (selected) {
    page.drawText('X', { x: selected.x, y: selected.y, size: 12, font });
  }

  if (disclosureApplicable) {
    page.drawText('X', { x: 441, y: 520, size: 12, font });
  }

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=W9-Filled.pdf',
    },
  });
}
