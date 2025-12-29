# Offline Support Guide

## Overview

This document provides guidelines and implementation strategies for offline support in the Splitter application, ensuring users can continue to use core features even when network connectivity is limited or unavailable.

## Offline Support Strategy

The Splitter application implements a comprehensive offline support strategy that includes:

1. **Data Caching**: Store frequently accessed data locally
2. **Offline Operations**: Allow users to perform actions offline
3. **Sync Mechanism**: Synchronize data when connectivity is restored
4. **User Experience**: Provide clear feedback about offline status

## Backend Offline Considerations

### API Design for Offline Support

The backend API is designed to support offline functionality through:

1. **Conflict Resolution**: Handle data conflicts during sync
2. **Versioning**: Track data versions to detect conflicts
3. **Delta Sync**: Sync only changed data to minimize bandwidth
4. **Offline-First Endpoints**: Design endpoints that work well offline

### Conflict Resolution

```typescript
// Implement version-based conflict detection
interface VersionedDocument {
  _id: string;
  _version: number;
  _lastModified: Date;
  data: any;
}

// Conflict resolution strategy
const resolveConflict = (local: VersionedDocument, remote: VersionedDocument) => {
  // Last-write-wins strategy
  if (local._lastModified > remote._lastModified) {
    return local;
  }
  return remote;
};
```

### Delta Sync Implementation

```typescript
// Implement delta sync for efficient data transfer
app.get('/api/sync/delta', async (req, res) => {
  const { lastSync } = req.query;
  const userId = req.user.id;
  
  // Get changes since last sync
  const changes = await getChangesSince(userId, new Date(lastSync as string));
  
  res.json({
    changes,
    timestamp: new Date()
  });
});
```

## Frontend Offline Implementation

### Data Persistence

The frontend uses AsyncStorage for data persistence with the following strategy:

#### AsyncStorage Wrapper

```typescript
// src/services/storage.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  async setItem(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }
  
  async getItem(key: string) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }
  
  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }
  
  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export default new StorageService();
```

#### Cached Data Structure

```typescript
// src/types/offline.types.ts
export interface OfflineData {
  users: CachedUser[];
  groups: CachedGroup[];
  expenses: CachedExpense[];
  settlements: CachedSettlement[];
  lastSync: Date;
  pendingOperations: PendingOperation[];
}

export interface CachedUser {
  id: string;
  name: string;
  email: string;
  lastUpdated: Date;
}

export interface CachedGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  creator: string;
  lastUpdated: Date;
}

export interface CachedExpense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  group: string;
  splits: {
    user: string;
    amount: number;
  }[];
  category: string;
  date: Date;
  lastUpdated: Date;
}

export interface CachedSettlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  group: string;
  description: string;
  date: Date;
  lastUpdated: Date;
}

export interface PendingOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'user' | 'group' | 'expense' | 'settlement';
  data: any;
  timestamp: Date;
  attempts: number;
}
```

### Network Status Detection

#### Network Status Hook

```typescript
// src/hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  return { isConnected, isInternetReachable };
};
```

#### Network Status Component

```tsx
// src/components/NetworkStatusIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const NetworkStatusIndicator = () => {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  
  if (isConnected && isInternetReachable) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {isConnected 
          ? 'Limited connectivity' 
          : 'No internet connection'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF9500',
    padding: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NetworkStatusIndicator;
```

### Offline Data Management

#### Data Synchronization Service

```typescript
// src/services/sync.service.ts
import { OfflineData, PendingOperation } from '@/types/offline.types';
import storageService from './storage.service';
import api from './api';

class SyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  
  async syncData() {
    try {
      // Get offline data
      const offlineData = await storageService.getItem('offlineData');
      if (!offlineData) return;
      
      // Process pending operations
      await this.processPendingOperations(offlineData.pendingOperations);
      
      // Fetch latest data from server
      await this.fetchLatestData();
      
      // Update last sync timestamp
      await storageService.setItem('lastSync', new Date());
      
      console.log('Data synchronization completed');
    } catch (error) {
      console.error('Sync error:', error);
    }
  }
  
  private async processPendingOperations(operations: PendingOperation[]) {
    for (const operation of operations) {
      try {
        switch (operation.type) {
          case 'CREATE':
            await this.createEntity(operation);
            break;
          case 'UPDATE':
            await this.updateEntity(operation);
            break;
          case 'DELETE':
            await this.deleteEntity(operation);
            break;
        }
        
        // Remove successful operation
        await this.removePendingOperation(operation.id);
      } catch (error) {
        console.error('Operation failed:', error);
        // Increment attempt count or handle retry logic
        await this.incrementOperationAttempts(operation.id);
      }
    }
  }
  
  private async createEntity(operation: PendingOperation) {
    switch (operation.entityType) {
      case 'expense':
        await api.expenses.create(operation.data);
        break;
      case 'settlement':
        await api.settlements.create(operation.data);
        break;
      // Add other entity types
    }
  }
  
  private async updateEntity(operation: PendingOperation) {
    switch (operation.entityType) {
      case 'expense':
        await api.expenses.update(operation.data.id, operation.data);
        break;
      case 'group':
        await api.groups.update(operation.data.id, operation.data);
        break;
      // Add other entity types
    }
  }
  
  private async deleteEntity(operation: PendingOperation) {
    switch (operation.entityType) {
      case 'expense':
        await api.expenses.delete(operation.data.id);
        break;
      case 'group':
        await api.groups.delete(operation.data.id);
        break;
      // Add other entity types
    }
  }
  
  private async removePendingOperation(id: string) {
    const offlineData = await storageService.getItem('offlineData');
    if (offlineData) {
      offlineData.pendingOperations = offlineData.pendingOperations.filter(
        op => op.id !== id
      );
      await storageService.setItem('offlineData', offlineData);
    }
  }
  
  private async incrementOperationAttempts(id: string) {
    const offlineData = await storageService.getItem('offlineData');
    if (offlineData) {
      const operation = offlineData.pendingOperations.find(op => op.id === id);
      if (operation) {
        operation.attempts += 1;
        await storageService.setItem('offlineData', offlineData);
      }
    }
  }
  
  private async fetchLatestData() {
    // Fetch latest data from server and update local cache
    const [users, groups, expenses, settlements] = await Promise.all([
      api.users.getAll(),
      api.groups.getAll(),
      api.expenses.getAll(),
      api.settlements.getAll()
    ]);
    
    const offlineData: OfflineData = {
      users: users.data.users,
      groups: groups.data.groups,
      expenses: expenses.data.expenses,
      settlements: settlements.data.settlements,
      lastSync: new Date(),
      pendingOperations: []
    };
    
    await storageService.setItem('offlineData', offlineData);
  }
  
  startAutoSync(interval: number = 30000) {
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, interval);
  }
  
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

export default new SyncService();
```

### Offline Operations

#### Offline Expense Creation

```typescript
// src/services/offline-expense.service.ts
import { v4 as uuidv4 } from 'uuid';
import storageService from './storage.service';
import syncService from './sync.service';

class OfflineExpenseService {
  async createExpense(expenseData: any) {
    // Check network status
    const isOnline = await this.checkNetworkStatus();
    
    if (isOnline) {
      // Create expense online
      return await api.expenses.create(expenseData);
    } else {
      // Create expense offline
      return await this.createOfflineExpense(expenseData);
    }
  }
  
  private async createOfflineExpense(expenseData: any) {
    // Generate local ID
    const localId = `local_${uuidv4()}`;
    
    // Create offline expense object
    const offlineExpense = {
      id: localId,
      ...expenseData,
      lastUpdated: new Date(),
      isLocal: true
    };
    
    // Save to local storage
    const offlineData = await storageService.getItem('offlineData') || {
      users: [],
      groups: [],
      expenses: [],
      settlements: [],
      lastSync: new Date(),
      pendingOperations: []
    };
    
    offlineData.expenses.push(offlineExpense);
    
    // Add to pending operations
    offlineData.pendingOperations.push({
      id: uuidv4(),
      type: 'CREATE',
      entityType: 'expense',
      data: expenseData,
      timestamp: new Date(),
      attempts: 0
    });
    
    await storageService.setItem('offlineData', offlineData);
    
    // Start sync process when online
    this.setupOnlineSync();
    
    return {
      success: true,
      data: {
        expense: offlineExpense
      }
    };
  }
  
  private async checkNetworkStatus() {
    // Implementation to check network connectivity
    // This would use the NetInfo library or similar
    return true; // Placeholder
  }
  
  private setupOnlineSync() {
    // Set up listener for when device comes online
    // This would trigger syncService.syncData()
  }
}

export default new OfflineExpenseService();
```

### User Experience

#### Offline Mode Indicator

```tsx
// src/components/OfflineModeIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const OfflineModeIndicator = () => {
  const { isConnected } = useNetworkStatus();
  
  if (isConnected) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline Mode</Text>
      <Text style={styles.description}>
        You can still view and create expenses. Changes will sync when you're back online.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: 'white',
    fontSize: 14,
  },
});

export default OfflineModeIndicator;
```

#### Offline-Compatible Components

```tsx
// src/components/OfflineExpenseForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import offlineExpenseService from '@/services/offline-expense.service';

const OfflineExpenseForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const { isConnected } = useNetworkStatus();
  
  const handleSubmit = async () => {
    try {
      const expenseData = {
        description,
        amount: parseFloat(amount),
        // ... other expense data
      };
      
      const result = await offlineExpenseService.createExpense(expenseData);
      
      if (result.success) {
        Alert.alert(
          'Success',
          isConnected 
            ? 'Expense created successfully' 
            : 'Expense saved offline. It will sync when you\'re back online.'
        );
        
        // Reset form
        setDescription('');
        setAmount('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create expense');
    }
  };
  
  return (
    <View>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button 
        title={isConnected ? "Create Expense" : "Save Offline"} 
        onPress={handleSubmit}
      />
    </View>
  );
};

export default OfflineExpenseForm;
```

## Data Synchronization

### Conflict Resolution

#### Last-Write-Wins Strategy

```typescript
// src/services/conflict-resolution.service.ts
class ConflictResolutionService {
  resolveExpenseConflict(local: any, remote: any) {
    // Last-write-wins strategy
    if (new Date(local.lastUpdated) > new Date(remote.lastUpdated)) {
      return local;
    }
    return remote;
  }
  
  resolveGroupConflict(local: any, remote: any) {
    // More complex conflict resolution for groups
    // Consider member changes, name changes, etc.
    
    const localTime = new Date(local.lastUpdated);
    const remoteTime = new Date(remote.lastUpdated);
    
    if (localTime > remoteTime) {
      return this.mergeGroupChanges(local, remote);
    }
    
    return this.mergeGroupChanges(remote, local);
  }
  
  private mergeGroupChanges(primary: any, secondary: any) {
    // Merge changes from secondary into primary
    return {
      ...primary,
      members: [...new Set([...primary.members, ...secondary.members])],
      lastUpdated: new Date()
    };
  }
}

export default new ConflictResolutionService();
```

### Sync Queue Management

```typescript
// src/services/sync-queue.service.ts
class SyncQueueService {
  private queue: any[] = [];
  private isProcessing = false;
  
  async addToQueue(operation: any) {
    this.queue.push(operation);
    this.processQueue();
  }
  
  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      while (this.queue.length > 0) {
        const operation = this.queue.shift();
        await this.processOperation(operation);
      }
    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  private async processOperation(operation: any) {
    try {
      // Process the operation
      switch (operation.type) {
        case 'SYNC_EXPENSE':
          await this.syncExpense(operation.data);
          break;
        case 'SYNC_GROUP':
          await this.syncGroup(operation.data);
          break;
        // Add other operation types
      }
    } catch (error) {
      // Retry logic or move to failed operations queue
      console.error('Operation failed:', error);
      this.handleOperationFailure(operation, error);
    }
  }
  
  private async syncExpense(expense: any) {
    // Implementation for syncing expense
  }
  
  private async syncGroup(group: any) {
    // Implementation for syncing group
  }
  
  private handleOperationFailure(operation: any, error: any) {
    // Handle failed operations
    // Could retry, move to failed queue, or notify user
  }
}

export default new SyncQueueService();
```

## Testing Offline Support

### Unit Tests

```typescript
// src/services/offline-expense.service.test.ts
import offlineExpenseService from './offline-expense.service';
import storageService from './storage.service';

jest.mock('./storage.service');
jest.mock('./api');

describe('OfflineExpenseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createExpense', () => {
    it('should create expense online when connected', async () => {
      // Mock online status
      (offlineExpenseService as any).checkNetworkStatus = jest.fn().mockResolvedValue(true);
      
      const expenseData = {
        description: 'Test expense',
        amount: 100
      };
      
      const result = await offlineExpenseService.createExpense(expenseData);
      
      expect(result.success).toBe(true);
    });
    
    it('should create expense offline when disconnected', async () => {
      // Mock offline status
      (offlineExpenseService as any).checkNetworkStatus = jest.fn().mockResolvedValue(false);
      
      const expenseData = {
        description: 'Test expense',
        amount: 100
      };
      
      const result = await offlineExpenseService.createExpense(expenseData);
      
      expect(result.success).toBe(true);
      expect(storageService.setItem).toHaveBeenCalled();
    });
  });
});
```

### Integration Tests

```typescript
// src/integration/offline-sync.test.ts
import syncService from '@/services/sync.service';
import storageService from '@/services/storage.service';

describe('Offline Sync Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should sync pending operations', async () => {
    const mockOfflineData = {
      users: [],
      groups: [],
      expenses: [],
      settlements: [],
      lastSync: new Date(),
      pendingOperations: [
        {
          id: '1',
          type: 'CREATE',
          entityType: 'expense',
          data: { description: 'Test', amount: 100 },
          timestamp: new Date(),
          attempts: 0
        }
      ]
    };
    
    (storageService.getItem as jest.Mock).mockResolvedValue(mockOfflineData);
    
    await syncService.syncData();
    
    expect(storageService.setItem).toHaveBeenCalled();
  });
});
```

## Performance Considerations

### Storage Optimization

#### Data Compression

```typescript
// src/services/compression.service.ts
import { deflate, inflate } from 'pako';

class CompressionService {
  compress(data: any): Uint8Array {
    const jsonString = JSON.stringify(data);
    const uint8Array = new TextEncoder().encode(jsonString);
    return deflate(uint8Array);
  }
  
  decompress(compressedData: Uint8Array): any {
    const decompressed = inflate(compressedData);
    const jsonString = new TextDecoder().decode(decompressed);
    return JSON.parse(jsonString);
  }
}

export default new CompressionService();
```

#### Storage Limits

```typescript
// src/services/storage-manager.service.ts
class StorageManagerService {
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB
  
  async checkStorageUsage() {
    // Implementation to check current storage usage
    // This would depend on the specific storage solution used
  }
  
  async cleanupOldData() {
    // Remove old cached data to stay within storage limits
  }
}
```

## User Experience Guidelines

### Offline Feedback

1. **Clear Indicators**: Show when the app is offline
2. **Action Feedback**: Inform users when actions are saved locally
3. **Sync Status**: Show sync progress and completion
4. **Error Handling**: Handle sync failures gracefully

### Progressive Enhancement

1. **Core Features First**: Ensure core functionality works offline
2. **Enhanced Features**: Add online-only features as enhancements
3. **Graceful Degradation**: Handle missing features gracefully

### Data Freshness

1. **Last Updated**: Show when data was last updated
2. **Stale Data**: Indicate when data might be stale
3. **Refresh Options**: Provide manual refresh options

## Best Practices

### Data Management

1. **Minimize Data**: Only cache necessary data
2. **Version Data**: Track data versions for conflict resolution
3. **Clean Up**: Regularly clean up old cached data
4. **Encrypt Sensitive**: Encrypt sensitive cached data

### Network Handling

1. **Retry Logic**: Implement exponential backoff for retries
2. **Batch Operations**: Batch multiple operations when possible
3. **Prioritize Sync**: Prioritize critical data sync
4. **Handle Errors**: Gracefully handle network errors

### User Experience

1. **Transparent**: Be clear about offline status
2. **Consistent**: Maintain consistent UI in offline mode
3. **Helpful**: Provide helpful error messages
4. **Responsive**: Keep UI responsive during sync

## Troubleshooting

### Common Issues

1. **Sync Conflicts**: Implement proper conflict resolution
2. **Storage Limits**: Monitor and manage storage usage
3. **Network Detection**: Ensure accurate network status detection
4. **Data Consistency**: Maintain data consistency across devices

### Debugging

```typescript
// src/utils/offline-debugger.ts
class OfflineDebugger {
  logSyncOperation(operation: any) {
    console.log('Sync Operation:', {
      type: operation.type,
      entityType: operation.entityType,
      timestamp: operation.timestamp,
      data: operation.data
    });
  }
  
  logConflictResolution(local: any, remote: any, resolved: any) {
    console.log('Conflict Resolution:', {
      local: local.lastUpdated,
      remote: remote.lastUpdated,
      resolved: resolved.lastUpdated
    });
  }
  
  logStorageUsage() {
    // Log current storage usage for debugging
  }
}

export default new OfflineDebugger();
```

## Future Improvements

### Advanced Features

1. **Selective Sync**: Allow users to choose what data to sync
2. **Offline Analytics**: Provide analytics while offline
3. **Peer-to-Peer Sync**: Enable device-to-device sync
4. **Predictive Caching**: Cache data based on usage patterns

### Performance Enhancements

1. **Incremental Sync**: Only sync changed data
2. **Background Sync**: Perform sync operations in background
3. **Compression**: Compress data for storage and transfer
4. **Indexing**: Index cached data for faster queries

## Resources

### Libraries and Tools

- **@react-native-netinfo**: Network information for React Native
- **@react-native-async-storage**: AsyncStorage for React Native
- **pako**: Compression library for JavaScript
- **uuid**: UUID generation for unique IDs

### Learning Resources

- **Offline First**: https://offlinefirst.org/
- **Progressive Web Apps**: https://web.dev/progressive-web-apps/
- **Service Workers**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- **IndexedDB**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

## Contact

For offline support-related questions or concerns, please contact:

- **Offline Support Team**: offline@splitter.app
- **Emergency**: offline-emergency@splitter.app (24/7)

## Updates

This offline support guide will be reviewed and updated annually or as needed based on:
- New offline technologies and best practices
- Feedback from offline usage analytics
- Changes in React Native offline capabilities
- User feedback and requirements
- Industry standards and guidelines