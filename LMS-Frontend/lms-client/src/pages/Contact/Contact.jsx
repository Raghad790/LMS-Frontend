import React from "react";
import ContactHero from "../../components/ui/contact/ContactHero";
import ContactForm from "../../components/ui/contact/ContactForm";
import ContactInfo from "../../components/ui/contact/ContactInfo";
import ContactFAQ from "../../components/ui/contact/ContactFAQ";
import { Box, Container, Grid } from "@mui/material";

const Contact = () => {
  return (
    <>
      <ContactHero />

      <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <ContactInfo />
            </Grid>
            <Grid item xs={12} md={8}>
              <ContactForm />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <ContactFAQ />
    </>
  );
};

export default Contact;
