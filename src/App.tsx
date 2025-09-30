import React, { useState, useEffect } from 'react';
import './App.css';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  // BUG: Added optional field that's sometimes undefined
  notes?: string;
  // BUG: Wrong type - should be string but using number
  age: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  // BUG: Added field that doesn't match the interface usage
  assignedTo: Customer;
  // BUG: Wrong type - should be boolean
  isUrgent: string;
}

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  // BUG: Missing required fields from Customer interface
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'pending' as const
    // BUG: Missing age field that's required
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
    // BUG: Wrong type - should be Customer object
    assignedTo: 'John Doe',
    // BUG: Wrong type - should be boolean
    isUrgent: 'yes'
  });
  const [activeTab, setActiveTab] = useState<'customers' | 'tasks'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [error, setError] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Load sample data with 6-second delay to show loading issue
  useEffect(() => {
    setLoading(true);
    setLoadingProgress(0);
    
    // BUG: 6-second delay that will be visible in replay
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 15;
      });
    }, 1000);
    
    setTimeout(() => {
      // BUG: Missing required fields from Customer interface
      setCustomers([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-0123',
          status: 'active',
          lastContact: '2024-01-15'
          // BUG: Missing age field that's required
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '555-0456',
          status: 'inactive',
          lastContact: '2024-01-10'
          // BUG: Missing age field that's required
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '555-0789',
          status: 'pending',
          lastContact: '2024-01-20'
          // BUG: Missing age field that's required
        }
      ]);

      // BUG: Missing required fields from Task interface
      setTasks([
        {
          id: 1,
          title: 'Follow up with John Doe',
          description: 'Call about new product proposal',
          priority: 'high',
          completed: false,
          dueDate: '2024-01-25'
          // BUG: Missing assignedTo and isUrgent fields
        },
        {
          id: 2,
          title: 'Update customer database',
          description: 'Clean up inactive customers',
          priority: 'medium',
          completed: true,
          dueDate: '2024-01-20'
          // BUG: Missing assignedTo and isUrgent fields
        },
        {
          id: 3,
          title: 'Prepare quarterly report',
          description: 'Compile sales data for Q1',
          priority: 'low',
          completed: false,
          dueDate: '2024-01-30'
          // BUG: Missing assignedTo and isUrgent fields
        }
      ]);
      
      setLoadingProgress(100);
      setShowData(true);
      setLoading(false);
      
      // BUG: This will cause memory leak - no cleanup
      setTimeout(() => {
        setLoading(true);
      }, 1000);
    }, 6000); // 6-second delay - very visible in replay
    
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
    
    // BUG: Missing required fields, wrong types
    const customer: Customer = {
      id: nextId,
      ...newCustomer,
      lastContact: new Date().toISOString().split('T')[0],
      // BUG: age is required but not provided
      age: '25' // BUG: Wrong type - should be number
    };
    
    // BUG: This will cause state update on unmounted component
    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', email: '', phone: '', status: 'pending' });
    
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
    
    // BUG: Wrong types, missing required fields
    const task: Task = {
      id: nextId,
      ...newTask,
      completed: false,
      // BUG: assignedTo should be Customer object, not string
      assignedTo: newCustomer, // BUG: Wrong type
      // BUG: isUrgent should be boolean, not string
      isUrgent: 'true' // BUG: Wrong type
    };
    
    // BUG: This will cause type error
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: 'John Doe', isUrgent: 'yes' });
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
      {/* BUG: This will cause error - age is number but displaying as string */}
      <td>{customer.age}</td>
      {/* BUG: This will cause error - notes might be undefined */}
      <td>{customer.notes.toUpperCase()}</td>
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
    // BUG: This will cause error if searchTerm is undefined
    const searchLower = searchTerm.toLowerCase();
    
    // BUG: This will cause error if customer.name is undefined
    const nameMatch = customer.name.toLowerCase().includes(searchLower);
    const emailMatch = customer.email.toLowerCase().includes(searchLower);
    
    // BUG: This will cause error if customer.notes is undefined
    const notesMatch = customer.notes && customer.notes.toLowerCase().includes(searchLower);
    
    return nameMatch || emailMatch || notesMatch;
  });

  const filteredTasks = tasks.filter(task => {
    // BUG: This will cause error if searchTerm is undefined
    const searchLower = searchTerm.toLowerCase();
    
    // BUG: This will cause error if task.title is undefined
    const titleMatch = task.title.toLowerCase().includes(searchLower);
    const descMatch = task.description.toLowerCase().includes(searchLower);
    
    // BUG: This will cause error - assignedTo is Customer object, not string
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
              {/* BUG: This will cause error - age field is missing from newCustomer */}
              <input
                type="number"
                placeholder="Age"
                value={newCustomer.age}
                onChange={(e) => setNewCustomer({...newCustomer, age: e.target.value})}
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
              {/* BUG: This will cause error - assignedTo field has wrong type */}
              <input
                type="text"
                placeholder="Assigned To"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                required
              />
              {/* BUG: This will cause error - isUrgent field has wrong type */}
              <select
                value={newTask.isUrgent}
                onChange={(e) => setNewTask({...newTask, isUrgent: e.target.value})}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
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
                    {/* BUG: This will cause error - assignedTo is Customer object, not string */}
                    <span className="assigned-to">Assigned to: {task.assignedTo}</span>
                    {/* BUG: This will cause error - isUrgent is string, not boolean */}
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