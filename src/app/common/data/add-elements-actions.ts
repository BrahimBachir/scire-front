export interface IElementAction {
    tooltip: string;
    label: string;
    entity: string;
    icon: string;
    buttonClass: string;
    plans?: string[];
}

export const ADD_ELEMENTS_ACTIONS: IElementAction[] = [
    {
        tooltip: "Crear una pregunta",
        label: "Crear una pregunta",
        entity: "QUESTION",
        icon: "help-circle",
        buttonClass: 'bg-primary text-white',
    },
    {
        tooltip: "Crear un elemento con IA",
        label: "Crear un elemento con IA",
        entity: "AI",
        icon: "sparkles",
        buttonClass: 'bg-success text-white',
        plans: ['SILVER', 'GOLD']
    },
    {
        tooltip: "Crear un esquema",
        label: "Crear un esquema",
        entity: "DIAGRAM",
        icon: "schema",
        buttonClass: 'bg-secondary text-white'
    },
    {
        tooltip: "Crear una flashcard",
        label: "Crear una flashcard",
        entity: "FLASHCARD",
        icon: "flip-vertical",
        buttonClass: 'bg-warning text-white'
    },
    {
        tooltip: "Aportar un nuevo vídeo",
        label: "Aportar un nuevo vídeo",
        entity: "VIDEO",
        icon: "video",
        buttonClass: 'bg-error text-white'
    },
    {
        tooltip: "Añadir una nota",
        label: "Añadir una nota",
        entity: "NOTE",
        icon: "note",
        buttonClass: 'text-primary'
    }
]

export function getElementActionByEntity(entity: string): IElementAction | undefined {
    return ADD_ELEMENTS_ACTIONS.find(action => action.entity === entity);
}