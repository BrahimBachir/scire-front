import { IMenuOption } from "../models/interfaces";

export const UserMenu: IMenuOption[] = [
    {
        title: "Perfil",
        icon: "person",
        url: "account/profile",
        type: "link"
    },
    {
        title: "Configuración",
        icon: "settings",
        url: "account/settings",
        type: "link"
    },
    {
        title: "Cursos",
        icon: "school",
        url: "account/settings",
        role: "[STUDENT,INSTRUCTOR]",
        type: "link"
    },    
    {
        title: "Cursos",
        icon: "help",
        url: "account/settings",
        role: "[STUDENT,INSTRUCTOR]",
        type: "link"
    }
]
