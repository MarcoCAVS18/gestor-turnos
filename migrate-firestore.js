/**
 * FIRESTORE MIGRATION SCRIPT
 * 
 * Migrate data from Spanish collections to English collections
 * 
 * Usage: 
 *   node migrate-firestore.js
 * 
 * Requirements:
 *   - Node.js installed
 *   - Firebase Admin SDK initialized
 *   - Service account credentials
 */

const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gestionturnos-7ec99.firebaseio.com'
});

const db = admin.firestore();

// Migration configuration
const MIGRATION_CONFIG = {
  dryRun: false, // Set to true to test without actually writing
  batchSize: 100,
  verbose: true,
  backupBeforeMigration: true // Optional: Creates backup of old collections
};

// Collection mappings
const COLLECTION_MAPPINGS = {
  // User subcollections
  'trabajos': 'works',
  'turnos': 'shifts',
  'trabajos-delivery': 'delivery-works',
  'turnos-delivery': 'delivery-shifts',
  
  // Root collections
  'trabajos_compartidos': 'shared-works',
  'usuarios': 'users'
};

// Progress tracking
let migrationStats = {
  totalDocuments: 0,
  migratedDocuments: 0,
  failedDocuments: 0,
  skippedDocuments: 0,
  startTime: null,
  endTime: null
};

/**
 * Log migration progress
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    'info': 'ℹ️',
    'success': '✅',
    'error': '❌',
    'warning': '⚠️',
    'progress': '🔄'
  };
  console.log(`[${timestamp}] ${prefix[type] || 'ℹ️'} ${message}`);
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get all documents from a collection
 */
async function getAllDocuments(collectionRef) {
  const snapshot = await collectionRef.get();
  const documents = [];
  snapshot.forEach(doc => {
    documents.push({
      id: doc.id,
      data: doc.data()
    });
  });
  return documents;
}

/**
 * Check if collection exists
 */
async function collectionExists(collectionPath) {
  try {
    const snapshot = await db.collection(collectionPath).limit(1).get();
    return !snapshot.empty;
  } catch (error) {
    return false;
  }
}

/**
 * Backup collection to Firestore
 */
async function backupCollection(sourcePath, timestamp) {
  const backupPath = `${sourcePath}_backup_${timestamp}`;
  log(`Creating backup of ${sourcePath} to ${backupPath}`, 'info');
  
  const sourceCollection = db.collection(sourcePath);
  const backupCollection = db.collection(backupPath);
  
  const documents = await getAllDocuments(sourceCollection);
  migrationStats.totalDocuments += documents.length;
  
  let backedUp = 0;
  const batch = db.batch();
  let batchCount = 0;
  
  for (const doc of documents) {
    const docRef = backupCollection.doc(doc.id);
    batch.set(docRef, doc.data);
    batchCount++;
    
    if (batchCount >= MIGRATION_CONFIG.batchSize) {
      await batch.commit();
      backedUp += batchCount;
      batchCount = 0;
      
      if (MIGRATION_CONFIG.verbose) {
        log(`Backed up ${backedUp}/${documents.length} documents`, 'progress');
      }
    }
  }
  
  if (batchCount > 0) {
    await batch.commit();
    backedUp += batchCount;
  }
  
  log(`Backup completed: ${backedUp} documents backed up`, 'success');
  return documents.length;
}

/**
 * Migrate documents from source to destination
 */
async function migrateDocuments(sourcePath, destinationPath) {
  log(`Migrating ${sourcePath} -> ${destinationPath}`, 'progress');
  
  const sourceCollection = db.collection(sourcePath);
  const destinationCollection = db.collection(destinationPath);
  
  // Check if destination already has data
  const destinationExists = await collectionExists(destinationPath);
  if (destinationExists) {
    log(`Destination ${destinationPath} already exists. Checking...`, 'warning');
    const existingDocs = await getAllDocuments(destinationCollection);
    if (existingDocs.length > 0) {
      log(`Destination has ${existingDocs.length} documents. Skipping migration.`, 'warning');
      migrationStats.skippedDocuments += existingDocs.length;
      return false;
    }
  }
  
  // Get all documents from source
  const documents = await getAllDocuments(sourceCollection);
  
  if (documents.length === 0) {
    log(`No documents found in ${sourcePath}. Skipping.`, 'info');
    return true;
  }
  
  migrationStats.totalDocuments += documents.length;
  let migrated = 0;
  let failed = 0;
  
  // Migrate in batches
  for (let i = 0; i < documents.length; i += MIGRATION_CONFIG.batchSize) {
    const batch = documents.slice(i, i + MIGRATION_CONFIG.batchSize);
    const writeBatch = db.batch();
    
    for (const doc of batch) {
      const docRef = destinationCollection.doc(doc.id);
      writeBatch.set(docRef, doc.data);
    }
    
    try {
      if (!MIGRATION_CONFIG.dryRun) {
        await writeBatch.commit();
      }
      migrated += batch.length;
      
      if (MIGRATION_CONFIG.verbose) {
        const progress = Math.round((migrated / documents.length) * 100);
        log(`Progress: ${migrated}/${documents.length} (${progress}%)`, 'progress');
      }
    } catch (error) {
      log(`Batch migration failed: ${error.message}`, 'error');
      failed += batch.length;
      migrationStats.failedDocuments += batch.length;
    }
  }
  
  migrationStats.migratedDocuments += migrated;
  
  if (migrated === documents.length) {
    log(`✓ Successfully migrated ${migrated} documents from ${sourcePath}`, 'success');
  } else {
    log(`⚠ Partial migration: ${migrated}/${documents.length} succeeded, ${failed} failed`, 'warning');
  }
  
  return migrated === documents.length;
}

/**
 * Migrate all user data
 */
async function migrateUserData(userId) {
  log(`\n=== Migrating user ${userId} ===`, 'info');
  
  const userSubcollections = [
    'trabajos',
    'turnos',
    'trabajos-delivery',
    'turnos-delivery'
  ];
  
  let successCount = 0;
  
  for (const subcollection of userSubcollections) {
    const sourcePath = `usuarios/${userId}/${subcollection}`;
    const destinationPath = `users/${userId}/${COLLECTION_MAPPINGS[subcollection]}`;
    
    // Backup if enabled
    if (MIGRATION_CONFIG.backupBeforeMigration && !MIGRATION_CONFIG.dryRun) {
      try {
        await backupCollection(sourcePath, Date.now());
      } catch (error) {
        log(`Backup failed for ${sourcePath}: ${error.message}`, 'error');
      }
    }
    
    // Migrate
    const success = await migrateDocuments(sourcePath, destinationPath);
    if (success) successCount++;
  }
  
  log(`User ${userId}: ${successCount}/${userSubcollections.length} collections migrated`, 'success');
}

/**
 * Migrate root collections
 */
async function migrateRootCollections() {
  log('\n=== Migrating Root Collections ===', 'info');
  
  const rootCollections = [
    'trabajos_compartidos',
    'usuarios'
  ];
  
  for (const collection of rootCollections) {
    if (collection === 'usuarios') {
      // Special handling for users - migrate each user's data
      log('Migrating user collection (will process individual users separately)', 'info');
      continue;
    }
    
    const sourcePath = collection;
    const destinationPath = COLLECTION_MAPPINGS[collection];
    
    // Backup if enabled
    if (MIGRATION_CONFIG.backupBeforeMigration && !MIGRATION_CONFIG.dryRun) {
      try {
        await backupCollection(sourcePath, Date.now());
      } catch (error) {
        log(`Backup failed for ${sourcePath}: ${error.message}`, 'error');
      }
    }
    
    await migrateDocuments(sourcePath, destinationPath);
  }
}

/**
 * Get all users
 */
async function getAllUsers() {
  log('Fetching all users...', 'info');
  
  const usersSnapshot = await db.collection('usuarios').get();
  const users = [];
  
  usersSnapshot.forEach(doc => {
    users.push(doc.id);
  });
  
  log(`Found ${users.length} users`, 'info');
  return users;
}

/**
 * Main migration function
 */
async function runMigration() {
  log('\n' + '='.repeat(60), 'info');
  log('FIRESTORE MIGRATION: SPANISH -> ENGLISH', 'info');
  log('='.repeat(60), 'info');
  
  migrationStats.startTime = new Date();
  
  if (MIGRATION_CONFIG.dryRun) {
    log('⚠️ DRY RUN MODE - No actual changes will be made', 'warning');
  }
  
  try {
    // 1. Migrate root collections (except usuarios)
    await migrateRootCollections();
    
    // 2. Get all users
    const users = await getAllUsers();
    
    if (users.length === 0) {
      log('No users found to migrate', 'warning');
      return;
    }
    
    // 3. Migrate each user's data
    let userSuccessCount = 0;
    for (const userId of users) {
      const success = await migrateUserData(userId);
      if (success) userSuccessCount++;
    }
    
    // 4. Final statistics
    migrationStats.endTime = new Date();
    const duration = (migrationStats.endTime - migrationStats.startTime) / 1000;
    
    log('\n' + '='.repeat(60), 'info');
    log('MIGRATION SUMMARY', 'info');
    log('='.repeat(60), 'info');
    log(`Total documents processed: ${migrationStats.totalDocuments}`, 'info');
    log(`Documents migrated: ${migrationStats.migratedDocuments}`, 'success');
    log(`Documents failed: ${migrationStats.failedDocuments}`, migrationStats.failedDocuments > 0 ? 'error' : 'success');
    log(`Documents skipped: ${migrationStats.skippedDocuments}`, 'info');
    log(`Users processed: ${users.length}`, 'info');
    log(`Users fully migrated: ${userSuccessCount}/${users.length}`, 'success');
    log(`Duration: ${duration.toFixed(2)} seconds`, 'info');
    log('='.repeat(60), 'info');
    
    if (migrationStats.failedDocuments === 0 && migrationStats.migratedDocuments > 0) {
      log('✅ MIGRATION COMPLETED SUCCESSFULLY!', 'success');
      log('\nNext steps:', 'info');
      log('1. Verify data in Firebase Console', 'info');
      log('2. Test the application thoroughly', 'info');
      log('3. If everything works, delete old collections (see cleanup instructions)', 'info');
    } else if (migrationStats.failedDocuments > 0) {
      log('⚠️ MIGRATION COMPLETED WITH ERRORS', 'warning');
      log('Please review the logs above for details', 'info');
    } else {
      log('ℹ️ No documents were migrated (possibly already done or no data)', 'info');
    }
    
  } catch (error) {
    log(`❌ MIGRATION FAILED: ${error.message}`, 'error');
    log(`Stack trace: ${error.stack}`, 'error');
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  runMigration()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      log(`Fatal error: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = { runMigration, migrateDocuments, migrationStats };