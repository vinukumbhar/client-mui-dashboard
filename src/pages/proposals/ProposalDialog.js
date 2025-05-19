
// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Typography,
//   IconButton,
//   Box,
//   Divider,
//   List,
//   ListItemButton,
//   ListItemText,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const ProposalDialog = ({ open, handleClose, proposal }) => {
//   const [selectedSection, setSelectedSection] = useState(null);
// console.log("proposals", proposal)
//   useEffect(() => {
//     if (!proposal) return;

//     if (proposal.introduction) setSelectedSection("introduction");
//     else if (proposal.terms) setSelectedSection("terms");
//     else if (
//       proposal.servicesandinvoices &&
//       proposal.Additemizedserviceswithoutcreatinginvoices === "service"
//     )
//       setSelectedSection("services");
//     else if (
//       proposal.servicesandinvoices &&
//       proposal.Addinvoiceoraskfordeposit === "invoice"
//     )
//       setSelectedSection("invoices");
//   }, [proposal]);

//   if (!proposal) return null;

//   const sections = [];

//   if (proposal.introduction) {
//     sections.push({
//       key: "introduction",
//       label: proposal.introductiontextname,
//       content: proposal.introductiontext,
//     });
//   }

//   if (proposal.terms) {
//     sections.push({
//       key: "terms",
//       label: proposal.termsandconditionsname,
//       content: proposal.termsandconditions,
//     });
//   }

//   if (
//     proposal.servicesandinvoices &&
//     proposal.Additemizedserviceswithoutcreatinginvoices === "service"
//   ) {
//     const serviceHTML = proposal.lineItems
//       .map(
//         (item) => `
//         <div style="margin-bottom: 10px;">
//           <strong>${item.productorService}</strong> - ${item.description}<br/>
//           Rate: $${item.rate}, Qty: ${item.quantity}, Amount: $${item.amount}
//           ${item.tax ? " (Taxable)" : ""}
//         </div>
//       `
//       )
//       .join("");
//     sections.push({
//       key: "services",
//       label: "Services",
//       content: serviceHTML,
//     });
//   }

//   if (
//     proposal.servicesandinvoices &&
//     proposal.Addinvoiceoraskfordeposit === "invoice"
//   ) {
//     const invoiceHTML = `
//       <div>
//         <p><strong>Invoice Template:</strong> ${proposal.invoicetemplatename}</p>
//         <p><strong>Issue Invoice:</strong> ${proposal.issueinvoice}</p>
//         <div style="margin-top: 15px;">
//           ${proposal.lineItems
//             .map(
//               (item) => `
//             <div style="margin-bottom: 8px;">
//               <strong>${item.productorService}</strong> - ${item.description}<br/>
//               Rate: $${item.rate}, Qty: ${item.quantity}, Amount: $${item.amount}
//               ${item.tax ? " (Taxable)" : ""}
//             </div>`
//             )
//             .join("")}
//         </div>
//         <hr/>
//         <p><strong>Subtotal:</strong> $${proposal.summary?.subtotal}</p>
//         <p><strong>Tax (${proposal.summary?.taxRate}%):</strong> $${proposal.summary?.taxTotal}</p>
//         <p><strong>Total:</strong> $${proposal.summary?.total}</p>
//       </div>
//     `;
//     sections.push({
//       key: "invoices",
//       label: "Invoices",
//       content: invoiceHTML,
//     });
//   }

//   const currentSection = sections.find((s) => s.key === selectedSection);

//   return (
//     <Dialog fullScreen open={open} onClose={handleClose}>
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           px: 3,
//           py: 2,
//           borderBottom: "1px solid #ddd",
//         }}
//       >
//         <Typography variant="h6">
//           {proposal?.proposalname || "Proposal"}
//         </Typography>
//         <IconButton edge="end" color="inherit" onClick={handleClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ display: "flex", height: "100%", p: 0 }}>
//         {/* Left Navigation */}
//         <Box
//           sx={{
//             width: 250,
//             borderRight: "1px solid #ddd",
//             bgcolor: "#fafafa",
//             height: "100%",
//           }}
//         >
//           <List>
//             {sections.map((section) => (
//               <ListItemButton
//                 key={section.key}
//                 selected={selectedSection === section.key}
//                 onClick={() => setSelectedSection(section.key)}
//               >
//                 <ListItemText primary={section.label} />
//               </ListItemButton>
//             ))}
//           </List>
//         </Box>

//         {/* Right Content */}
//         <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
//           <Typography variant="h6" gutterBottom>
//             {currentSection?.label}
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <Box
//             dangerouslySetInnerHTML={{ __html: currentSection?.content }}
//             sx={{ lineHeight: 1.7 }}
//           />
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ProposalDialog;


import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProposalDialog = ({ open, handleClose, proposal }) => {
    console.log("proposals", proposal)
  const [selectedSection, setSelectedSection] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!proposal) return;

    if (proposal.introduction) setSelectedSection("introduction");
    else if (proposal.terms) setSelectedSection("terms");
    else if (
      proposal.servicesandinvoices &&
      proposal.Additemizedserviceswithoutcreatinginvoices === "service"
    )
      setSelectedSection("services");
    else if (
      proposal.servicesandinvoices &&
      proposal.Addinvoiceoraskfordeposit === "invoice"
    )
      setSelectedSection("invoices");
  }, [proposal]);

  useEffect(() => {
    if (selectedSection && sectionRefs.current[selectedSection]) {
      sectionRefs.current[selectedSection].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSection]);

  if (!proposal) return null;

  const sections = [];

  if (proposal.introduction) {
    sections.push({
      key: "introduction",
      label: proposal.introductiontextname,
      content: proposal.introductiontext,
    });
  }

  if (proposal.terms) {
    sections.push({
      key: "terms",
      label: proposal.termsandconditionsname,
      content: proposal.termsandconditions,
    });
  }
  if (
  proposal.servicesandinvoices &&
  proposal.Additemizedserviceswithoutcreatinginvoices === "service"
) {
  const serviceHTML = `
    <div style="font-family: Arial, sans-serif; color: #1e1e1e;">
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
        <thead style="background-color: #f9fafb;">
          <tr>
            <th style="text-align: left; padding: 8px;">Service</th>
            <th style="text-align: right; padding: 8px;">Rate</th>
            <th style="text-align: right; padding: 8px;">Qty</th>
            <th style="text-align: right; padding: 8px;">Tax</th>
            <th style="text-align: right; padding: 8px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${proposal.lineItems
            .map(
              (item) => `
              <tr>
                <td style="padding: 8px;">
                  <div><strong>${item.productorService}</strong></div>
                  <div style="font-size: 12px; color: #6b7280;">${item.description}</div>
                </td>
                <td style="text-align: right; padding: 8px;">$ ${Number(item.rate).toFixed(2)}</td>
                <td style="text-align: right; padding: 8px;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px;">$ ${item.tax ? "0.00" : "0.00"}</td>
                <td style="text-align: right; padding: 8px;">$ ${Number(item.amount).toFixed(2)}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align: right; padding: 8px;"><strong>Total</strong></td>
            <td style="text-align: right; padding: 8px;"><strong>$ ${proposal.summary?.total.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  sections.push({
    key: "services",
    label: "Services",
    content: serviceHTML,
  });
}


//   if (
//     proposal.servicesandinvoices &&
//     proposal.Additemizedserviceswithoutcreatinginvoices === "service"
//   ) {
//     const serviceHTML = proposal.lineItems
//       .map(
//         (item) => `
//         <div style="margin-bottom: 10px;">
//           <strong>${item.productorService}</strong> - ${item.description}<br/>
//           Rate: $${item.rate}, Qty: ${item.quantity}, Amount: $${item.amount}
//           ${item.tax ? " (Taxable)" : ""}
//         </div>
//       `
//       )
//       .join("");
//     sections.push({
//       key: "services",
//       label: "Services",
//       content: serviceHTML,
//     });
//   }


// if (
//   proposal.servicesandinvoices &&
//   proposal.Addinvoiceoraskfordeposit === "invoice"
// ) {
//   const invoiceHTML = `
//     <div style="font-family: Arial, sans-serif; color: #1e1e1e;">
//       <div style="margin-bottom: 20px;">
//         <p><strong>Amount</strong></p>
//         <p style="background-color: #f9fafb; padding: 10px; border-radius: 8px;">$${proposal.summary?.total.toFixed(2)}</p>
        
//         <p><strong>Invoice will be issued</strong></p>
//         <p style="background-color: #f9fafb; padding: 10px; border-radius: 8px;">${proposal.issueinvoice}</p>
        
//         <p><strong>Description</strong></p>
//         <p style="background-color: #f9fafb; padding: 10px; border-radius: 8px;">${proposal.description}</p>
//       </div>

//       <div>
//         <p style="font-weight: bold; margin-bottom: 10px;">&#x25BC; Invoice details</p>
//         <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
//           <thead style="background-color: #f9fafb;">
//             <tr>
//               <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb;">Service</th>
//               <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Rate</th>
//               <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Qty</th>
//               <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Tax</th>
//               <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${proposal.lineItems
//               .map(
//                 (item) => `
//                 <tr>
//                   <td style="padding: 8px;">
//                     <div><strong>${item.productorService}</strong></div>
//                     <div style="font-size: 12px; color: #6b7280;">${item.description}</div>
//                   </td>
//                   <td style="text-align: right; padding: 8px;">$ ${Number(item.rate).toFixed(2)}</td>
//                   <td style="text-align: right; padding: 8px;">${item.quantity}</td>
//                   <td style="text-align: right; padding: 8px;">$ ${item.tax ? "0.00" : "0.00"}</td>
//                   <td style="text-align: right; padding: 8px;">$ ${Number(item.amount).toFixed(2)}</td>
//                 </tr>
//               `
//               )
//               .join("")}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colspan="4" style="text-align: right; padding: 8px; border-top: 1px solid #e5e7eb;"><strong>Total</strong></td>
//               <td style="text-align: right; padding: 8px; border-top: 1px solid #e5e7eb;"><strong>$ ${proposal.summary?.total.toFixed(2)}</strong></td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   `;

//   sections.push({
//     key: "invoices",
//     label: "Invoices",
//     content: invoiceHTML,
//   });
// }

if (
  proposal.servicesandinvoices &&
  proposal.Addinvoiceoraskfordeposit === "invoice"
) {
  const invoiceHTML = `
    <div style="font-family: Arial, sans-serif; color: #1e1e1e;">
      <div style="margin-bottom: 20px;">
        <p><strong>Amount</strong></p>
        <p style="background-color: #f9fafb; padding: 10px; border-radius: 8px;">$${proposal.summary?.total.toFixed(2)}</p>

        <p><strong>Invoice will be issued</strong></p>
        <p style="background-color: #f9fafb; padding: 10px; border-radius: 8px;">${proposal.issueinvoice}</p>

        <p><strong>Description</strong></p>
        <p style="background-color: #f9fafb; padding: 10px; border-radius: 8px;">${proposal.description}</p>
      </div>

      <div>
        <p 
          style="font-weight: bold; margin-bottom: 10px; cursor: pointer;"
          onclick="const table = this.nextElementSibling; const arrow = this.querySelector('span'); if (table.style.display === 'none') { table.style.display = 'block'; arrow.innerHTML = '&#x25B2;'; } else { table.style.display = 'none'; arrow.innerHTML = '&#x25BC;'; }"
        >
          <span>&#x25BC;</span> Invoice details
        </p>

        <div style="display: none;">
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
            <thead style="background-color: #f9fafb;">
              <tr>
                <th style="text-align: left; padding: 8px;">Service</th>
                <th style="text-align: right; padding: 8px;">Rate</th>
                <th style="text-align: right; padding: 8px;">Qty</th>
                <th style="text-align: right; padding: 8px;">Tax</th>
                <th style="text-align: right; padding: 8px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${proposal.lineItems
                .map(
                  (item) => `
                  <tr>
                    <td style="padding: 8px;">
                      <div><strong>${item.productorService}</strong></div>
                      <div style="font-size: 12px; color: #6b7280;">${item.description}</div>
                    </td>
                    <td style="text-align: right; padding: 8px;">$ ${Number(item.rate).toFixed(2)}</td>
                    <td style="text-align: right; padding: 8px;">${item.quantity}</td>
                    <td style="text-align: right; padding: 8px;">$ ${item.tax ? "0.00" : "0.00"}</td>
                    <td style="text-align: right; padding: 8px;">$ ${Number(item.amount).toFixed(2)}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align: right; padding: 8px;"><strong>Total</strong></td>
                <td style="text-align: right; padding: 8px;"><strong>$ ${proposal.summary?.total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  `;

  sections.push({
    key: "invoices",
    label: "Invoices",
    content: invoiceHTML,
  });
}


 sections.push({
  key: "signature",
  label: "Sign & accept",
  content: `
    <div style="font-family: Arial, sans-serif; color: #1e1e1e; max-width: 500px; ">
      <div style="text-align: center; margin-bottom: 30px;">
       
        <p style="color: #666; margin-bottom: 20px;">your signature</p>
        
        <div style="text-align: left; margin-bottom: 25px;">
          <label style="display: flex; align-items: flex-start; cursor: pointer;">
            <input 
              type="checkbox" 
              id="acceptTermsCheckbox" 
              style="margin-right: 10px; margin-top: 3px;"
              onchange="document.getElementById('completeButton').style.display = this.checked ? 'block' : 'none'"
            >
            <span>I accept the above terms and TaxDome's Terms of Service</span>
          </label>
        </div>
        
        <button 
          id="completeButton"
          style="
            display: none;
            background-color: #4f46e5;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            font-weight: bold;
          "
        >
          Complete
        </button>
      </div>
    </div>
  `,
});

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="h6" component="p" >
          {proposal?.proposalname || "Proposal"}
        </Typography>
        <IconButton edge="end"  onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", height: "100%", p: 0 }}>
        {/* Left Navigation */}
        <Box
          sx={{
            width: 250,
            borderRight: "1px solid #ddd",
         
            height: "100%",
          }}
        >
          <List>
            {sections.map((section) => (
              <ListItemButton
                key={section.key}
                selected={selectedSection === section.key}
                onClick={() => setSelectedSection(section.key)}
              >
                <ListItemText primary={section.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Right Content - Scrollable All Sections */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {sections.map((section) => (
            <Box
              key={section.key}
              ref={(el) => (sectionRefs.current[section.key] = el)}
              sx={{ mb: 6 }}
            >
              <Typography  variant="h6" component="p"
              gutterBottom
              sx={{ fontWeight: "600" }}>
                {section.label}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                dangerouslySetInnerHTML={{ __html: section.content }}
                sx={{ lineHeight: 1.7 }}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDialog;
