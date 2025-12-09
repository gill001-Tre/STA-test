/**
 * ============================================
 * AZURE TABLE STORAGE SERVICE
 * ============================================
 * 
 * Handles user role storage in Azure Table Storage.
 * Roles are NOT stored in Entra ID - they're custom
 * roles stored in Table Storage.
 */

import { CONFIG } from '../config/appConfig';

export interface TableEntity {
  PartitionKey: string;
  RowKey: string;
  [key: string]: unknown;
}

export interface UserRoleEntity extends TableEntity {
  Role: string;
  Email: string;
  DisplayName: string;
  CreatedAt: string;
  UpdatedAt: string;
}

const DEMO_ROLES_KEY = 'demo_user_roles';

class TableStorageService {
  private config: typeof CONFIG.AZURE_STORAGE | null = null;

  constructor() {
    this.config = CONFIG.AZURE_STORAGE;
  }

  /**
   * Check if in demo mode
   */
  private isDemoMode(): boolean {
    return CONFIG.DEMO_MODE;
  }

  /**
   * Check if configured
   */
  isConfigured(): boolean {
    if (this.isDemoMode()) return true;
    return !!(this.config?.accountName && this.config?.sasToken);
  }

  /**
   * Get base URL for Azure Table Storage
   */
  private getBaseUrl(): string {
    if (!this.config) throw new Error('Table Storage not configured');
    return `https://${this.config.accountName}.table.core.windows.net/${this.config.userRolesTable}`;
  }

  /**
   * Demo mode: Get data from localStorage
   */
  private getDemoData(): Record<string, UserRoleEntity> {
    try {
      const data = localStorage.getItem(DEMO_ROLES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Demo mode: Save data to localStorage
   */
  private saveDemoData(data: Record<string, UserRoleEntity>): void {
    localStorage.setItem(DEMO_ROLES_KEY, JSON.stringify(data));
  }

  /**
   * Get an entity from the table
   */
  async getEntity(partitionKey: string, rowKey: string): Promise<UserRoleEntity | null> {
    if (this.isDemoMode()) {
      const data = this.getDemoData();
      const key = `${partitionKey}__${rowKey}`;
      return data[key] || null;
    }

    if (!this.config?.sasToken) return null;

    try {
      const entityPath = `(PartitionKey='${encodeURIComponent(partitionKey)}',RowKey='${encodeURIComponent(rowKey)}')`;
      let sasToken = this.config.sasToken;
      if (!sasToken.startsWith('?')) sasToken = '?' + sasToken;

      const response = await fetch(`${this.getBaseUrl()}${entityPath}${sasToken}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2019-02-02'
        }
      });

      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Failed to get entity: ${response.status}`);

      return await response.json();

    } catch (error) {
      console.error('[TableStorage] Error getting entity:', error);
      return null;
    }
  }

  /**
   * Upsert an entity (insert or update)
   */
  async upsertEntity(entity: UserRoleEntity): Promise<boolean> {
    if (this.isDemoMode()) {
      const data = this.getDemoData();
      const key = `${entity.PartitionKey}__${entity.RowKey}`;
      data[key] = entity;
      this.saveDemoData(data);
      return true;
    }

    if (!this.config?.sasToken) return false;

    try {
      const entityPath = `(PartitionKey='${encodeURIComponent(entity.PartitionKey)}',RowKey='${encodeURIComponent(entity.RowKey)}')`;
      let sasToken = this.config.sasToken;
      if (!sasToken.startsWith('?')) sasToken = '?' + sasToken;

      const response = await fetch(`${this.getBaseUrl()}${entityPath}${sasToken}`, {
        method: 'MERGE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2019-02-02',
          'If-Match': '*'
        },
        body: JSON.stringify(entity)
      });

      if (!response.ok) throw new Error(`Failed to upsert: ${response.status}`);
      return true;

    } catch (error) {
      console.error('[TableStorage] Error upserting entity:', error);
      return false;
    }
  }
}

export const tableStorageService = new TableStorageService();
export default TableStorageService;
