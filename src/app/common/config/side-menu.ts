import { IMenuOption } from "../models/interfaces";

export const SideMenu: IMenuOption[] = [
    {
        title: "Panel",
        icon: "dashboard",
        url: "user/dashboard",
        role: "USER"
    },
    {
        title: "Teoría",
        icon: "book_3",
        url: "user/theory",
        role: "USER"
    },
    {
        title: "Práctica",
        icon: "assignment",
        url: "user/practice",
        role: "USER"
    },
    {
        title: "Memorización",
        icon: "dynamic_feed",
        url: "user/flashcards",
        role: "USER"
    },
    {
        title: "Plan de estudio",
        icon: "event_repeat",
        url: "user/tracker",
        role: "USER"
    },    
    {
        title: "Diagrmas",
        icon: "account_tree",
        url: "user/mermaid",
        role: "USER"
    },
        {
        title: "Videos",
        icon: "ondemand_video",
        url: "user/videos",
        role: "USER"
    }
]
