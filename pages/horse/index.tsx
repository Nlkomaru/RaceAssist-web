import { GetStaticProps, NextPage } from "next";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { HorseData } from "../../src/v1/HorseData";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
    CardActionArea,
    Collapse,
    FormControlLabel,
    IconButton,
    IconButtonProps,
    Switch,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { css } from "@emotion/css";
import Image from "next/image";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

dayjs.extend(timezone);
dayjs.extend(utc);

const colorList = ["BLACK", "BROWN", "CHESTNUT", "CREAMY", "DARK_BROWN", "GRAY", "WHITE"];
const styleList = ["BLACK_DOTS", "NONE", "WHITE", "WHITE_DOTS", "WHITEFIELD"];

const minDistance = 0.1;
const speed = atom({
    key: "speed",
    default: {
        min: 8.0,
        max: 15.0,
    },
});

const speedSelector = selector({
    key: "speedSelector",
    get: ({ get }) => {
        return get(speed);
    },
    set: ({ set }, newValue) => {
        set(speed, newValue);
    },
});

const jump = atom({
    key: "jump",
    default: {
        min: 2.0,
        max: 5.5,
    },
});

const jumpSelector = selector({
    key: "jumpSelector",
    get: ({ get }) => {
        return get(jump);
    },
    set: ({ set }, newValue) => {
        set(jump, newValue);
    },
});

const style = atom<String[]>({
    key: "style",
    default: [],
});

const styleSelector = selector({
    key: "styleSelector",
    get: ({ get }) => {
        return get(style);
    },
    set: ({ set }, newValue) => {
        set(style, newValue);
    },
});

const color = atom<String[]>({
    key: "color",
    default: [],
});

const colorSelector = selector({
    key: "colorSelector",
    get: ({ get }) => {
        return get(color);
    },
    set: ({ set }, newValue) => {
        set(color, newValue);
    },
});

const horseAlive = atom({
    key: "alive",
    default: false,
});

const horseAliveSelector = selector({
    key: "aliveSelector",
    get: ({ get }) => {
        return get(horseAlive);
    },
    set: ({ set }, newValue) => {
        set(horseAlive, newValue);
    },
});

const expand = atom({
    key: "expand",
    default: false,
});

const expandSelector = selector({
    key: "expandSelector",
    get: ({ get }) => {
        return get(expand);
    },
    set: ({ set }, newValue) => {
        set(expand, newValue);
    },
});

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

function FilterComponent() {
    const [expandValue, setExpandValue] = useRecoilState(expandSelector);
    const handleExpandClick = () => {
        setExpandValue(!expandValue);
    };
    return (
        <div className={filterStyle}>
            <ExpandMore
                expand={expandValue}
                onClick={handleExpandClick}
                aria-expanded={expandValue}
                aria-label="show more"
            >
                <ExpandMoreIcon />
            </ExpandMore>
            ????????????????????????
            <Card
                sx={{
                    width: 700,
                    display: "flex",
                    alignItems: "center",
                }}
                className={selectHorseStatusStyle}
            >
                <Collapse
                    sx={{
                        paddingLeft: "50px",
                        paddingRight: "50px",
                        paddingTop: "10px",
                        paddingBottom: "30px", //???????????????
                    }}
                    in={expandValue}
                    timeout="auto"
                    unmountOnExit
                >
                    <SelectHorseColorOption />
                    <SelectHorseStyleOption />
                    <div className={limiterStyle}>
                        <LimitHorseSpeed />
                        <LimitHorseJump />
                    </div>
                    <HorseAliveButton />
                </Collapse>
            </Card>
        </div>
    );
}

const Home: NextPage<PageProps> = (props: PageProps) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>horse / RaceAssist</title>
                <meta name="description" content="RaceAssist-web" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            <div className={horseStatusDisplayStyle}>
                <FilterComponent />
                <div className={lastUpdateDateStyle}>?????????????????? : {props.props.lastUpdate}</div>
            </div>
            <HorseList list={props.props.data} />
            <Footer />
        </div>
    );
};
const horseStatusDisplayStyle = css({
    display: "flex",
    justifyContent: "space-between",
});
const filterStyle = css({});

const lastUpdateDateStyle = css({
    textAlign: "right",
});

function speedValueText(value: number) {
    return `${value} m/s`;
}

function jumpValueText(value: number) {
    return `${value} m`;
}

function LimitHorseSpeed() {
    const [speedValue, setSpeedValue] = useRecoilState(speedSelector);
    const handleChange1 = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setSpeedValue({
                min: Math.min(newValue[0], speedValue.max - minDistance),
                max: speedValue.max,
            });
        } else {
            setSpeedValue({
                min: speedValue.min,
                max: Math.max(newValue[1], speedValue.min + minDistance),
            });
        }
    };
    return (
        <div>
            ??????
            <Slider
                sx={{
                    marginLeft: "10px",
                    marginTop: "10px",
                    width: "580px",
                }}
                getAriaLabel={() => "Minimum distance"}
                value={[speedValue.min, speedValue.max]}
                onChange={handleChange1}
                getAriaValueText={speedValueText}
                valueLabelFormat={speedValueText}
                valueLabelDisplay="auto"
                step={0.1}
                min={8.0}
                max={14.6}
            />
        </div>
    );
}

function LimitHorseJump() {
    const [jumpValue, setJumpValue] = useRecoilState(jumpSelector);
    const handleChange1 = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setJumpValue({
                min: Math.min(newValue[0], jumpValue.max - minDistance),
                max: jumpValue.max,
            });
        } else {
            setJumpValue({
                min: jumpValue.min,
                max: Math.max(newValue[1], jumpValue.min + minDistance),
            });
        }
    };
    return (
        <div>
            ???????????????
            <Slider
                sx={{
                    marginLeft: "10px",
                    marginTop: "10px",
                    width: "580px",
                }}
                value={[jumpValue.min, jumpValue.max]}
                onChange={handleChange1}
                getAriaValueText={jumpValueText}
                valueLabelFormat={jumpValueText}
                valueLabelDisplay="auto"
                step={0.1}
                min={2.0}
                max={5.5}
            />
        </div>
    );
}

const limiterStyle = css({
    marginTop: "10px",
});

function HorseAliveButton() {
    const [alive, setAlive] = useRecoilState(horseAliveSelector);
    return (
        <div>
            <FormControlLabel
                sx={{
                    display: "block",
                    marginTop: "10px",
                }}
                control={
                    <Switch
                        sx={{
                            marginLeft: "3px",
                        }}
                        checked={alive}
                        onChange={() => setAlive(!alive)}
                        name="loading"
                        color="primary"
                    />
                }
                label="?????????????????????"
            />
        </div>
    );
}

function SelectHorseColorOption() {
    const [, setSelectedColor] = useRecoilState(colorSelector);
    return (
        <Autocomplete
            className={skinStyle}
            multiple
            id="Color"
            options={colorList}
            getOptionLabel={(option) => option}
            defaultValue={[]}
            onChange={(e, v) => setSelectedColor(v)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="?????????"
                    placeholder="??????????????????"
                />
            )}
        />
    );
}

function SelectHorseStyleOption() {
    const [, setSelectedStyle] = useRecoilState(styleSelector);
    return (
        <Autocomplete
            className={skinStyle}
            multiple
            id="Style"
            options={styleList}
            getOptionLabel={(option) => option}
            defaultValue={[]}
            onChange={(e, v) => setSelectedStyle(v)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="????????????"
                    placeholder="?????????????????????"
                />
            )}
        />
    );
}

function HorseList(props: { list: HorseData[] }) {
    const list = props.list;
    const speedLimit = useRecoilValue(speed);
    const jumpLimit = useRecoilValue(jump);
    const selectedColor = useRecoilValue(color);
    const selectedStyle = useRecoilValue(style);
    const alive = useRecoilValue(horseAlive);
    return (
        <div className={listStyle}>
            {list
                .filter((data) => selectedColor.includes(data.color) || selectedColor.length === 0)
                .filter((data) => selectedStyle.includes(data.style) || selectedStyle.length === 0)
                .filter((data) => data.speed >= speedLimit.min && data.speed <= speedLimit.max)
                .filter((data) => data.jump >= jumpLimit.min && data.jump <= jumpLimit.max)
                .filter((data) => !alive || data.deathData == null)
                .map((data) => {
                    return <HorseCard key={data.horse} data={data} />;
                })}
        </div>
    );
}

function HorseCard(props: { data: HorseData }) {
    const data = props.data;
    const [ownerName, setOwnerName] = useState("");
    const [breederName, setBreederName] = useState("");
    useEffect(() => {
        const fetchName = async () => {
            const result = await getUsername(data.owner);
            setOwnerName(result);
            const result2 = await getUsername(data.breeder);
            setBreederName(result2);
        };
        fetchName().then((r) => r);
    }, [data.breeder, data.owner]);

    let imageUrl = "/horse/" + data.color + "-" + data.style + ".webp";
    return (
        <div className={boxStyle}>
            <Card
                sx={{
                    maxWidth: "300", // circle around the edge
                    borderRadius: "10%",
                }}
            >
                <CardActionArea href={"/horse/" + data.horse}>
                    <CardContent>
                        <Image
                            src={imageUrl}
                            alt={data.horse}
                            className={mediaStyle}
                            width={200}
                            height={200 * (100 / 90)}
                        />

                        <Typography sx={{ fontSize: 14 }} variant="body1" color="text.secondary">
                            <ul className={playerTypography}>
                                <li>?????? : {ownerName}</li>
                                <li>????????? : {breederName}</li>
                                <li>?????? : {data.name ?? "??????"}</li>
                            </ul>
                            <ul className={horseTypography}>
                                <li>????????? : {calculateRank(data)}</li>
                                <li>???????????? : {data.speed.toRound(2).toString()}</li>
                                <li>???????????? : {data.jump.toRound(2).toString()}</li>
                                <li>??????????????? : {data.deathData == null ? "??????" : "??????"}</li>
                            </ul>
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

type PageProps = {
    props: {
        data: HorseData[];
        lastUpdate: string;
    };
};
const listStyle = css({
    display: "flex",
    flexWrap: "wrap",
    textAlign: "center",
});

const selectHorseStatusStyle = css({});

const skinStyle = css({});

const playerTypography = css({
    textAlign: "left",
    marginBottom: "0px",
});

const horseTypography = css({
    marginTop: "0px",
    columnCount: 2,
    textAlign: "left",
});

const mediaStyle = css({
    padding: "20px",
});

const boxStyle = css({
    padding: "10px",
    flexBasis: "20%",
});

declare global {
    interface Number {
        toRound(base: Number): Number;
    }
}

Number.prototype.toRound = function (base: Number) {
    return Math.floor(this.valueOf() * Math.pow(10, base.valueOf())) / Math.pow(10, base.valueOf());
};

export const getStaticProps: GetStaticProps = async (context) => {
    // ?????????????????? [id].tsx ????????? id ???????????????????????????????????????????????????
    const res = await fetch(process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/listAll");
    let horseData = (await res.json()) as HorseData[];

    return {
        props: {
            props: {
                data: horseData,
                lastUpdate: `${dayjs().tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss")} JST`,
            },
        },
        revalidate: 60,
    };
};

export async function getUsername(uuid: string | null): Promise<string> {
    if (uuid == null) {
        return "??????";
    }
    const res = await fetch("https://playerdb.co/api/player/minecraft/" + uuid);
    const data = await res.json();
    return data.data.player.username;
}

export function calculateRank(data: HorseData): String {
    const speed = data.speed.valueOf() / 42.162962963;
    const jump = data.jump.valueOf();
    const jumpRate = Math.floor(jump * 2.0) / (2.0 * 5.0);
    const valMax = 0.3375 * 10 + 1.0;
    const value = speed * 10 + jumpRate;
    const rankString: String[] = [
        "G",
        "G",
        "G",
        "F",
        "F",
        "F",
        "E",
        "E",
        "E",
        "D",
        "D",
        "D",
        "C",
        "C+",
        "C++",
        "B",
        "B+",
        "B++",
        "A",
        "A+",
        "A++",
        "S",
        "S+",
        "S++",
        "LEGEND",
    ];
    const rate = (value / valMax) * 2.0 - 1.0;
    const pt = Math.floor(rate * rankString.length);
    if (pt >= rankString.length) {
        return rankString[rankString.length - 1];
    }
    if (pt < 0) {
        return rankString[0];
    }

    return rankString[pt];
}

export default Home;
