export const initialStore=()=>{
  return{
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    clients: [],
    administradores: [],
    tickets: [] 
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    case 'set_clients_list':

      console.log(action.payload)  

      return {
        ...store,
        clients: action.payload
      };

    case 'set_administradores':
      return {
        ...store,
        administradores: action.payload
      }

    case 'set_tickets':
      return {
        ...store,
        tickets: action.payload
      }
    
    default:
      throw Error('Unknown action.');
  }    
}
