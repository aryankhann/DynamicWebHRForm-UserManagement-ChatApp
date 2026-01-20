import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export interface Contract {
  id?: number;
  employee_id?: string;
  employee_name?: string;
  contract_type?: string;
  contract_title?: string;
  start_date?: string;
  end_date?: string;
  employee_type?: string;
  employee_category?: string;
  grade?: string;
  grade_step?: string;
  station?: string;
  department?: string;
  designation?: string;
  performance?: string;
  description?: string;
  notes?: string;
  custom_fields?: string;
  created_at?: string;
  updated_at?: string;
}
export interface User {
  id?: number;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  is_active: boolean;
  user_image?: string;
  role: 'admin' | 'user';
  created_at?: string;
  updated_at?: string;
}

export interface ContractDocument {
  id?: number;
  contract_id?: number;
  document_name: string;
  document_uri: string;
  document_type: string;
  document_size: number;
  created_at?: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabase({
        name: 'appDatabase.db',
        location: 'default',
      });
      
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  private async createTables() {
    if (!this.db) return;

    try {
     await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT,
        password TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        user_image TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS contracts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          employee_id TEXT,
          employee_name TEXT,
          contract_type TEXT,
          contract_title TEXT,
          start_date TEXT,
          end_date TEXT,
          employee_type TEXT,
          employee_category TEXT,
          grade TEXT,
          grade_step TEXT,
          station TEXT,
          department TEXT,
          designation TEXT,
          performance TEXT,
          description TEXT,
          notes TEXT,
          custom_fields TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS contract_documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contract_id INTEGER,
          document_name TEXT,
          document_uri TEXT,
          document_type TEXT,
          document_size INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contract_id) REFERENCES contracts (id) ON DELETE CASCADE
        );
      `);

      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }

//user methods
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number | null> {
  if (!this.db) {
    console.error('Database not initialized');
    return null;
  }

  try {
    const result = await this.db.executeSql(
      `INSERT INTO users (name, email, phone_number, password, is_active, user_image, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.name,
        userData.email,
        userData.phone_number || '',
        userData.password,
        userData.is_active ? 1 : 0,
        userData.user_image || '',
        userData.role || 'user'
      ]
    );

    const userId = result[0].insertId;
    console.log('User created with ID:', userId);
    return userId;
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      console.error('Email already exists');
    } else {
      console.error('Error creating user:', error);
    }
    return null;
  }
}
async updateUser(userId: number, userData: Partial<User>): Promise<boolean> {
  if (!this.db) {
    console.error('Database not initialized');
    return false;
  }

  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (userData.name !== undefined) {
      
      updates.push('name = ?');
      console.log('updates:',updates)
      values.push(userData.name);
      console.log('name',values)
    }
    if (userData.email !== undefined) {
      updates.push('email = ?');
      values.push(userData.email);
    }
    if (userData.phone_number !== undefined) {
      updates.push('phone_number = ?');
      values.push(userData.phone_number);
    }
    if (userData.password !== undefined) {
      updates.push('password = ?');
      values.push(userData.password);
    }
    if (userData.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(userData.is_active ? 1 : 0);
    }
    if (userData.user_image !== undefined) {
      updates.push('user_image = ?');
      values.push(userData.user_image);
    }
    if (userData.role !== undefined) {
      updates.push('role = ?');
      values.push(userData.role);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    await this.db.executeSql(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    console.log('User updated:', userId);
    return true;
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      console.error('Email already exists');
    } else {
      console.error('Error updating user:', error);
    }
    return false;
  }
}

  async registerUser(username: string, password: string): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized');
      return false;
    }


    try {
      await this.db.executeSql(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password]
      );
      console.log('User registered successfully');
      return true;
    } catch (error: any) {
      if (error.message?.includes('UNIQUE constraint failed')) {
        console.error('Username already exists');
      } else {
        console.error('Error registering user:', error);
      }
      return false;
    }
  }

  async loginUser(username: string, password: string): Promise<"admin" | "user" | false> {
  if (!this.db) {
    console.error('Database not initialized');
    return false;
  }

  try {
    const results = await this.db.executeSql(
      'SELECT name, password, role FROM users WHERE name = ? AND password = ?',
      [username, password]
    );

    if (results[0].rows.length > 0) {
      const user = results[0].rows.item(0);
      console.log('Login successful:', user.role);

      return user.role; 
    } else {
      console.log('Invalid credentials');
      return false;
    }
  } catch (error) {
    console.error('Error during login:', error);
    return false;
  }
}

async getUserById(userId: number): Promise<User | null> {
  if (!this.db) return null;

  try {
    const results = await this.db.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (results[0].rows.length > 0) {
      const user = results[0].rows.item(0);
      return {
        ...user,
        is_active: user.is_active === 1,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}
async getAllUsersForAdmin(): Promise<User[]> {
  if (!this.db) return [];

  try {
    const results = await this.db.executeSql(
      'SELECT * FROM users ORDER BY created_at DESC'
    );

    const users: User[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      const user = results[0].rows.item(i);
      users.push({
        ...user,
        is_active: user.is_active === 1,
      });
    }

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}
async deleteUser(userId: number): Promise<boolean> {
  if (!this.db) return false;

  try {
    await this.db.executeSql('DELETE FROM users WHERE id = ?', [userId]);
    console.log('User deleted:', userId);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

async toggleUserStatus(userId: number): Promise<boolean> {
  if (!this.db) return false;

  try {
    await this.db.executeSql(
      'UPDATE users SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
    console.log('User status toggled:', userId);
    return true;
  } catch (error) {
    console.error('Error toggling user status:', error);
    return false;
  }
}
  async getAllUsers() {
    if (!this.db) return [];

    try {
      const results = await this.db.executeSql(
        'SELECT id, name, created_at FROM users'
      );
      console.log('results',results)
      const users = [];
      const rows = results[0].rows;
      
      for (let i = 0; i < rows.length; i++) {
        users.push(rows.item(i));
      }
      console.log('users',users)
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

 async getDashboardStats(): Promise<{
  totalUsers: number;
  totalContracts: number;
  activeUsers: number;
  inactiveUsers: number;
}> {
  if (!this.db) {
    return { totalUsers: 0, totalContracts: 0, activeUsers: 0, inactiveUsers: 0 };
  }

  try {
    const userResult = await this.db.executeSql('SELECT COUNT(*) as count FROM users');
    const totalUsers = userResult[0].rows.item(0).count;

    const contractResult = await this.db.executeSql('SELECT COUNT(*) as count FROM contracts');
    const totalContracts = contractResult[0].rows.item(0).count;

    const activeResult = await this.db.executeSql('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
    const activeUsers = activeResult[0].rows.item(0).count;

    const inactiveUsers = totalUsers - activeUsers;

    return {
      totalUsers,
      totalContracts,
      activeUsers,
      inactiveUsers,
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { totalUsers: 0, totalContracts: 0, activeUsers: 0, inactiveUsers: 0 };
  }
}

//contract methods
  async createContract(contractData: Contract, documents?: any[]): Promise<number | null> {
    if (!this.db) {
      console.error('Database not initialized');
      return null;
    }

    try {
      const {
        employee_id, employee_name, contract_type, contract_title,
        start_date, end_date, employee_type, employee_category,
        grade, grade_step, station, department, designation,
        performance, description, notes, custom_fields
      } = contractData;

      const result = await this.db.executeSql(
        `INSERT INTO contracts (
          employee_id, employee_name, contract_type, contract_title,
          start_date, end_date, employee_type, employee_category,
          grade, grade_step, station, department, designation,
          performance, description, notes, custom_fields
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          employee_id || '', employee_name || '', contract_type || '', contract_title || '',
          start_date || '', end_date || '', employee_type || '', employee_category || '',
          grade || '', grade_step || '', station || '', department || '', designation || '',
          performance || '', description || '', notes || '', custom_fields || ''
        ]
      );

      const contractId = result[0].insertId;
      console.log('Contract created with ID:', contractId);

      
      if (documents && documents.length > 0) {
        await this.saveDocuments(contractId, documents);
      }

      return contractId;
    } catch (error) {
      console.error('Error creating contract:', error);
      return null;
    }
  }

  async updateContract(contractId: number, contractData: Contract, documents?: any[]): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized');
      return false;
    }

    try {
      const {
        employee_id, employee_name, contract_type, contract_title,
        start_date, end_date, employee_type, employee_category,
        grade, grade_step, station, department, designation,
        performance, description, notes, custom_fields
      } = contractData;

      await this.db.executeSql(
        `UPDATE contracts SET
          employee_id = ?, employee_name = ?, contract_type = ?, contract_title = ?,
          start_date = ?, end_date = ?, employee_type = ?, employee_category = ?,
          grade = ?, grade_step = ?, station = ?, department = ?, designation = ?,
          performance = ?, description = ?, notes = ?, custom_fields = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          employee_id || '', employee_name || '', contract_type || '', contract_title || '',
          start_date || '', end_date || '', employee_type || '', employee_category || '',
          grade || '', grade_step || '', station || '', department || '', designation || '',
          performance || '', description || '', notes || '', custom_fields || '',
          contractId
        ]
      );

      console.log('Contract updated:', contractId);

      if (documents && documents.length > 0) {
        await this.deleteDocumentsByContractId(contractId);
        await this.saveDocuments(contractId, documents);
      }

      return true;
    } catch (error) {
      console.error('Error updating contract:', error);
      return false;
    }
  }

  async getContractById(contractId: number): Promise<Contract | null> {
    if (!this.db) return null;

    try {
      const results = await this.db.executeSql(
        'SELECT * FROM contracts WHERE id = ?',
        [contractId]
      );

      if (results[0].rows.length > 0) {
        return results[0].rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error getting contract:', error);
      return null;
    }
  }

  async getAllContracts(): Promise<Contract[]> {
    if (!this.db) return [];

    try {
      const results = await this.db.executeSql(
        'SELECT * FROM contracts ORDER BY created_at DESC'
      );

      const contracts: Contract[] = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        contracts.push(results[0].rows.item(i));
      }

      return contracts;
    } catch (error) {
      console.error('Error getting all contracts:', error);
      return [];
    }
  }

  async deleteContract(contractId: number): Promise<boolean> {
    if (!this.db) return false;

    try {
      await this.deleteDocumentsByContractId(contractId);
      await this.db.executeSql('DELETE FROM contracts WHERE id = ?', [contractId]);
      console.log('Contract deleted:', contractId);
      return true;
    } catch (error) {
      console.error('Error deleting contract:', error);
      return false;
    }
  }

  async searchContracts(searchTerm: string): Promise<Contract[]> {
    if (!this.db) return [];

    try {
      const results = await this.db.executeSql(
        `SELECT * FROM contracts 
         WHERE employee_name LIKE ? 
         OR contract_title LIKE ? 
         OR contract_type LIKE ?
         ORDER BY created_at DESC`,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );

      const contracts: Contract[] = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        contracts.push(results[0].rows.item(i));
      }

      return contracts;
    } catch (error) {
      console.error('Error searching contracts:', error);
      return [];
    }
  }

//document methods
  private async saveDocuments(contractId: number, documents: any[]): Promise<void> {
    if (!this.db) return;

    try {
      for (const doc of documents) {
        await this.db.executeSql(
          `INSERT INTO contract_documents (
            contract_id, document_name, document_uri, document_type, document_size
          ) VALUES (?, ?, ?, ?, ?)`,
          [contractId, doc.name, doc.uri, doc.type || '', doc.size || 0]
        );
      }

      console.log(`${documents.length} document(s) saved for contract ${contractId}`);
    } catch (error) {
      console.error('Error saving documents:', error);
    }
  }

  async getDocumentsByContractId(contractId: number): Promise<ContractDocument[]> {
    if (!this.db) return [];

    try {
      const results = await this.db.executeSql(
        'SELECT * FROM contract_documents WHERE contract_id = ?',
        [contractId]
      );
      const documents: ContractDocument[] = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        documents.push(results[0].rows.item(i));
      }
      return documents;
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  private async deleteDocumentsByContractId(contractId: number): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.executeSql(
        'DELETE FROM contract_documents WHERE contract_id = ?',
        [contractId]
      );
      console.log('Documents deleted for contract:', contractId);
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
  }




  async dropAllTables() {
    if (!this.db) return;

    try {
      await this.db.executeSql('DROP TABLE IF EXISTS contract_documents');
      await this.db.executeSql('DROP TABLE IF EXISTS contracts');
      await this.db.executeSql('DROP TABLE IF EXISTS users');
      console.log('All tables dropped');
    } catch (error) {
      console.error('Error dropping tables:', error);
    }
  }
  

 
}

export default new DatabaseService();