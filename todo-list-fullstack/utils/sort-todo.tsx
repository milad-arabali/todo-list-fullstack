type Todo = {
    title: string;
    status: string;
    [key: string]: any;
};

function sortTodo(todo: Todo[]): Record<string, Todo[]> {
    const sortedData: Record<string, Todo[]> = {};

    todo.forEach((item) => {
        if (!sortedData[item.status]) {
            sortedData[item.status] = [];
        }
        sortedData[item.status].push(item);
    });

    return sortedData;
}

export default sortTodo ;
