import React, { useState, useEffect } from 'react';
import './App.css';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
}

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'pending' as const
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: ''
  });
  const [activeTab, setActiveTab] = useState<'customers' | 'tasks'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Load sample data
  useEffect(() => {
    setCustomers([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        status: 'active',
        lastContact: '2024-01-15'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-0456',
        status: 'inactive',
        lastContact: '2024-01-10'
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '555-0789',
        status: 'pending',
        lastContact: '2024-01-20'
      }
    ]);

    setTasks([
      {
        id: 1,
        title: 'Follow up with John Doe',
        description: 'Call about new product proposal',
        priority: 'high',
        completed: false,
        dueDate: '2024-01-25'
      },
      {
        id: 2,
        title: 'Update customer database',
        description: 'Clean up inactive customers',
        priority: 'medium',
        completed: true,
        dueDate: '2024-01-20'
      },
      {
        id: 3,
        title: 'Prepare quarterly report',
        description: 'Compile sales data for Q1',
        priority: 'low',
        completed: false,
        dueDate: '2024-01-30'
      }
    ]);
  }, []);

  // BUG 1: This function has a potential null reference error
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // BUG: This will throw an error if customers array is empty
    const nextId = Math.max(...customers.map(c => c.id)) + 1;
    
    const customer: Customer = {
      id: nextId,
      ...newCustomer,
      lastContact: new Date().toISOString().split('T')[0]
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', email: '', phone: '', status: 'pending' });
  };

  // BUG 2: This function has incorrect state update
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    
    const task: Task = {
      id: nextId,
      ...newTask,
      completed: false
    };
    
    // BUG: This should be setTasks, not setCustomers
    setCustomers([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
  };

  // BUG 3: This function has a logic error
  const toggleTaskComplete = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    // BUG: This will cause an infinite loop
    setTimeout(() => {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      ));
    }, 1000);
  };

  // BUG 4: This function has a potential memory leak
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    // BUG: This creates a new array on every keystroke without cleanup
    const filteredCustomers = customers.filter(customer => 
      customer.name.toLowerCase().includes(term.toLowerCase()) ||
      customer.email.toLowerCase().includes(term.toLowerCase())
    );
    
    // This should be memoized or moved to useEffect
    console.log('Filtered customers:', filteredCustomers);
  };

  // BUG 5: This function has incorrect event handling
  const handleButtonClick = (action: string) => {
    setLoading(true);
    
    // BUG: This will throw an error if action is undefined
    console.log(`Performing action: ${action.toUpperCase()}`);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // BUG: This will cause a re-render loop
      setLoading(true);
    }, 2000);
  };

  // BUG 6: This component has accessibility issues
  const renderCustomerRow = (customer: Customer) => (
    <tr key={customer.id}>
      <td>{customer.name}</td>
      <td>{customer.email}</td>
      <td>{customer.phone}</td>
      <td>
        <span className={`status status-${customer.status}`}>
          {customer.status}
        </span>
      </td>
      <td>{customer.lastContact}</td>
      <td>
        {/* BUG: Missing onClick handler */}
        <button className="btn btn-sm btn-primary">
          Edit
        </button>
        <button 
          className="btn btn-sm btn-danger"
          onClick={() => {
            // BUG: This will cause an error - customers is not defined in this scope
            setCustomers(customers.filter(c => c.id !== customer.id));
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>CRM System</h1>
        <p>Customer Relationship Management</p>
      </header>

      <nav className="nav-tabs">
        <button 
          className={`tab ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          Customers
        </button>
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
      </nav>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {activeTab === 'customers' && (
        <div className="customers-section">
          <h2>Customers</h2>
          
          <form onSubmit={handleCustomerSubmit} className="form">
            <h3>Add New Customer</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <select
                value={newCustomer.status}
                onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value as any})}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Customer
            </button>
          </form>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Last Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(renderCustomerRow)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="tasks-section">
          <h2>Tasks</h2>
          
          <form onSubmit={handleTaskSubmit} className="form">
            <h3>Add New Task</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>

          <div className="tasks-list">
            {filteredTasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className={`priority priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className="due-date">Due: {task.dueDate}</span>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    className={`btn btn-sm ${task.completed ? 'btn-success' : 'btn-outline'}`}
                    onClick={() => toggleTaskComplete(task.id)}
                  >
                    {task.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button 
          className="btn btn-primary"
          onClick={() => handleButtonClick('export')}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Export Data'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => handleButtonClick('import')}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Import Data'}
        </button>
        <button 
          className="btn btn-danger"
          onClick={() => handleButtonClick('deleteAll')}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Delete All Data'}
        </button>
      </div>
    </div>
  );
}

export default App;