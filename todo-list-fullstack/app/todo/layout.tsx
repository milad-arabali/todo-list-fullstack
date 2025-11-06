import type { Metadata } from "next";
import TodoLayout from "@/components/layout/todo-layout";

export const metadata: Metadata = {
    title: {
        default: "Todo App",
        template: "%s | Todo App",
    },
    openGraph: {
        type: "website",
        url: "https://example.com/todo",
        title: "Todo List Dashboard",
        description: "Manage your todos efficiently",
    },
};

export default function TodoPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <TodoLayout>{children}</TodoLayout>
        </div>
    );
}
