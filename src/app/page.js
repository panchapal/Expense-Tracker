// import Image from "next/image";
// import styles from "./page.module.css";
// // import Navbar from "../components/Navbar/Navbar";

// export default function Home() {
//   return (
//     <main>
//       {/* <h1>Welcome to the Expense Tracker</h1>
//       <a href="/auth/login">Login</a> | <a href="/auth/register">Register</a> */}
//       {/* <Navbar /> */}
//     </main>
//   );
// }


"use client";
import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import Image from "next/image";
import styles from "./page.module.css";

const Home = () => {
  return (
    <Box className={styles.heroSectionContent}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        className={styles.gridContainer}
      >
        <Grid item xs={12} md={6} className={styles.heroSectionText}>
          <Typography variant="h3" className={styles.heroHeadingContent}>
            Manage your money in the best possible{" "}
            <span
              style={{
                color: "#17d731",
                fontStyle: "italic",
                fontWeight: 600,
                transition: "color 0.3s ease-in-out",
              }}
            >
              way.
            </span>
          </Typography>
          <Typography variant="body1" className={styles.heroDescriptionContent}>
            Discover amazing features and content on our platform. Join us today
            and take the first step towards an incredible experience.
          </Typography>
          <Box className={styles.heroButtonContent}>
            {/* <Button variant="contained" className={styles.heroButton1}>
              Get Started
            </Button> */}
            <button className={styles.heroButton1}>Get Started</button>
            {/* <Button variant="outlined" className={styles.heroButton2}>
              Learn More
            </Button> */}
            <button className={styles.button}>Learn More</button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} className={styles.heroImage}>
          <Image
            src="/images/rb1.png"
            alt="Banner Image"
            width={500}
            height={400}
            className={styles.heroBanner}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
