import type {Metadata} from "next";
import TodoLayout from "@/components/layout/todo-layout";

export const metadata: Metadata = {
    title: "Todo List",
    description: "Manage your todo list app",
};

export default function TodoPageLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <TodoLayout>
                {children}
            </TodoLayout>
        </div>
    );
}
