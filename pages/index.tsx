import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Buffer } from "buffer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>RaceAssist-web</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            <Footer />
        </div>
    );
};

export default Home;
