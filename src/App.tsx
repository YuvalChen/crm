import React, { useState, useEffect } from 'react';
import './App.css';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  notes?: string;
  age: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  assignedTo: string;
  isUrgent: boolean;
}

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'pending' as const,
    age: 0,
    notes: ''
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
    assignedTo: '',
    isUrgent: false
  });
  const [activeTab, setActiveTab] = useState<'customers' | 'tasks'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [error, setError] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Load sample data with minimal delay
  useEffect(() => {
    setLoading(true);
    setLoadingProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 15;
      });
    }, 50);
    
    setTimeout(() => {
      setCustomers([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-0123',
          status: 'active',
          lastContact: '2024-01-15',
          age: 30,
          notes: 'VIP customer'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '555-0456',
          status: 'inactive',
          lastContact: '2024-01-10',
          age: 25,
          notes: 'Former customer'
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '555-0789',
          status: 'pending',
          lastContact: '2024-01-20',
          age: 35,
          notes: 'New lead'
        }
      ]);

      setTasks([
        {
          id: 1,
          title: 'Follow up with John Doe',
          description: 'Call about new product proposal',
          priority: 'high',
          completed: false,
          dueDate: '2024-01-25',
          assignedTo: 'John Doe',
          isUrgent: true
        },
        {
          id: 2,
          title: 'Update customer database',
          description: 'Clean up inactive customers',
          priority: 'medium',
          completed: true,
          dueDate: '2024-01-20',
          assignedTo: 'Jane Smith',
          isUrgent: false
        },
        {
          id: 3,
          title: 'Prepare quarterly report',
          description: 'Compile sales data for Q1',
          priority: 'low',
          completed: false,
          dueDate: '2024-01-30',
          assignedTo: 'Bob Johnson',
          isUrgent: false
        }
      ]);
      
      setLoadingProgress(100);
      setShowData(true);
      setLoading(false);
      
      // BUG: This will cause memory leak - no cleanup
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    }, 100);
    
    // BUG: This will cause infinite re-renders
    return () => {
      clearInterval(progressInterval);
      setLoading(false);
    };
  }, []); // BUG: Missing dependency array items

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // BUG: This will cause infinite re-renders
    setError('Error: Failed to add customer. Please try again.');
    
    // BUG: This will cause memory leak - no cleanup
    setTimeout(() => {
      setError('');
    }, 3000);
    
    // BUG: This will crash if customers array is empty
    const nextId = Math.max(...customers.map(c => c.id)) + 1;
    
    const customer: Customer = {
      id: nextId,
      ...newCustomer,
      lastContact: new Date().toISOString().split('T')[0]
    };
    
    // BUG: This will cause state update on unmounted component
    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', email: '', phone: '', status: 'pending', age: 0, notes: '' });
    
    // BUG: This will cause infinite loop
    setTimeout(() => {
      setCustomers([...customers, customer]);
    }, 1000);
  };

  // BUG 2: This function updates wrong state
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // BUG: This will crash if tasks array is empty
    const nextId = Math.max(...tasks.map(t => t.id)) + 1;
    
    const task: Task = {
      id: nextId,
      ...newTask,
      completed: false
    };
    
    // BUG: This will cause type error
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '', isUrgent: false });
  };

  const toggleTaskComplete = (taskId: number) => {
    // BUG: This will cause infinite re-renders
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    // BUG: This will cause memory leak and infinite loop
    setTimeout(() => {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      ));
    }, 1000);
    
    // BUG: This will cause error - tasks is not defined in this scope
    console.log('Task toggled:', tasks.find(t => t.id === taskId));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    // BUG: This will cause memory leak - creates new array on every keystroke
    const expensiveFilter = customers.filter(customer => {
      // BUG: This will cause performance issues
      for (let i = 0; i < 10000; i++) {
        Math.random();
      }
      return customer.name.toLowerCase().includes(term.toLowerCase());
    });
    
    // BUG: This will cause infinite re-renders
    setCustomers(expensiveFilter);
    
    // BUG: This will cause error - term might be undefined
    console.log('Searching for:', term.toUpperCase());
  };

  const handleButtonClick = (action: string) => {
    setLoading(true);
    setError('');
    
    // BUG: This will throw error if action is undefined
    console.log(`Performing action: ${action.toUpperCase()}`);
    
    // BUG: This will cause infinite re-render loop
    setTimeout(() => {
      setLoading(false);
      setLoading(true); // BUG: This causes infinite loop
      
      if (action === 'deleteAll') {
        // BUG: This will throw error - customers is not defined in this scope
        setCustomers([]);
        setTasks([]);
      }
      
      // BUG: This will cause error - action might be undefined
      if (action === 'export') {
        throw new Error('Export failed - permission denied');
      }
      
      setLoading(false);
    }, 2000);
  };

  const handleDeleteCustomer = (customerId: number) => {
    // BUG: This will cause error - customers is not defined in this scope
    setCustomers(customers.filter(c => c.id !== customerId));
    
    // BUG: This will cause infinite re-renders
    setTimeout(() => {
      setCustomers(customers.filter(c => c.id !== customerId));
    }, 1000);
    
    // BUG: This will cause error - customerId might be undefined
    console.log('Deleting customer:', customerId.toString());
  };

  const handleEditCustomer = (customerId: number) => {
    // BUG: This will cause infinite re-renders
    setCustomers(customers.map(c => 
      c.id === customerId 
        ? { ...c, name: c.name + ' (edited)' }
        : c
    ));
    
    // BUG: This will cause memory leak and infinite loop
    setTimeout(() => {
      setCustomers(customers.map(c => 
        c.id === customerId 
          ? { ...c, name: c.name.replace(' (edited)', '') }
          : c
      ));
    }, 500);
    
    // BUG: This will cause error - customerId might be undefined
    console.log('Editing customer:', customerId.toString());
  };

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
      <td>{customer.age}</td>
      <td>{customer.notes?.toUpperCase() || 'N/A'}</td>
      <td>
        <button 
          className="btn btn-sm btn-primary"
          onClick={() => handleEditCustomer(customer.id)}
        >
          Edit
        </button>
        <button 
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteCustomer(customer.id)}
        >
          Delete
        </button>
        {/* BUG: This will cause error - customer.id might be undefined */}
        <button 
          className="btn btn-sm btn-secondary"
          onClick={() => console.log('Customer details:', customer.id.toString())}
        >
          Details
        </button>
      </td>
    </tr>
  );

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    
    const nameMatch = customer.name.toLowerCase().includes(searchLower);
    const emailMatch = customer.email.toLowerCase().includes(searchLower);
    
    const notesMatch = customer.notes && customer.notes.toLowerCase().includes(searchLower);
    
    return nameMatch || emailMatch || notesMatch;
  });

  const filteredTasks = tasks.filter(task => {
    const searchLower = searchTerm.toLowerCase();
    
    const titleMatch = task.title.toLowerCase().includes(searchLower);
    const descMatch = task.description.toLowerCase().includes(searchLower);
    
    const assignedMatch = task.assignedTo && task.assignedTo.toLowerCase().includes(searchLower);
    
    return titleMatch || descMatch || assignedMatch;
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>CRM System</h1>
        <p>Customer Relationship Management</p>
        {loading && <div className="loading-spinner">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
      </header>

      {!showData && (
        <div className="loading-screen">
          <h2>Loading CRM Data...</h2>
          <p>Please wait while we load your data...</p>
          <div className="spinner"></div>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="progress-text">{loadingProgress}% Complete</p>
          </div>
          <p className="loading-text">This may take a few moments...</p>
        </div>
      )}

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

      {showData && activeTab === 'customers' && (
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
                      <input
                type="number"
                placeholder="Age"
                value={newCustomer.age}
                onChange={(e) => setNewCustomer({...newCustomer, age: parseInt(e.target.value) || 0})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Notes"
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
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
                  {/* BUG: Added columns that don't match the data */}
                  <th>Age</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* BUG: This will cause error - renderCustomerRow expects Customer but might get undefined */}
                {filteredCustomers.map(customer => renderCustomerRow(customer))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showData && activeTab === 'tasks' && (
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
              <input
                type="text"
                placeholder="Assigned To"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                required
              />
              <select
                value={newTask.isUrgent ? 'yes' : 'no'}
                onChange={(e) => setNewTask({...newTask, isUrgent: e.target.value === 'yes'})}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
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
                    <span className="assigned-to">Assigned to: {task.assignedTo}</span>
                    <span className="urgent">Urgent: {task.isUrgent ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    className={`btn btn-sm ${task.completed ? 'btn-success' : 'btn-outline'}`}
                    onClick={() => toggleTaskComplete(task.id)}
                  >
                    {task.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                  {/* BUG: This will cause error - task.id might be undefined */}
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => console.log('Task details:', task.id.toString())}
                  >
                    Details
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