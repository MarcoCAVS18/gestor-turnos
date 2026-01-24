/**
 * FIRESTORE RESTRUCTURE MIGRATION SCRIPT
 *
 * Migrate data from nested user subcollections to flattened collections for KPI optimization
 *
 * OLD STRUCTURE:
 * users/{userId}
 *   ├── works
 *   ├── shifts
 *   ├── works-delivery
 *   └── shifts-delivery
 *
 * NEW STRUCTURE:
 * users/{userId} (settings only)
 * works/{workId} (with userId field)
 * shifts/{shiftId} (with userId field)
 *
 * Usage:
 *   node restructure-firestore.js
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
  backupBeforeMigration: true,
  deleteOldData: false, // Set to true after verification
};

// Progress tracking
let migrationStats = {
  totalUsers: 0,
  migratedWorks: 0,
  migratedShifts: 0,
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

  const snapshot = await sourceCollection.get();
  let backedUp = 0;

  const batch = db.batch();
  let batchCount = 0;

  for (const doc of snapshot.docs) {
    const docRef = backupCollection.doc(doc.id);
    batch.set(docRef, doc.data());
    batchCount++;

    if (batchCount >= MIGRATION_CONFIG.batchSize) {
      await batch.commit();
      backedUp += batchCount;
      batchCount = 0;

      if (MIGRATION_CONFIG.verbose) {
        log(`Backed up ${backedUp}/${snapshot.size} documents`, 'progress');
      }
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    backedUp += batchCount;
  }

  log(`Backup completed: ${backedUp} documents backed up`, 'success');
  return snapshot.size;
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
 * Migrate works from user subcollection to root collection
 */
async function migrateUserWorks(userId, subcollectionName, type) {
  const sourcePath = `users/${userId}/${subcollectionName}`;
  const worksRef = db.collection('works');

  log(`Migrating works from ${sourcePath} (${type})`, 'progress');

  // Backup if enabled
  if (MIGRATION_CONFIG.backupBeforeMigration && !MIGRATION_CONFIG.dryRun) {
    try {
      await backupCollection(sourcePath, Date.now());
    } catch (error) {
      log(`Backup failed for ${sourcePath}: ${error.message}`, 'error');
      return false;
    }
  }

  // Get all works
  const sourceCollection = db.collection(sourcePath);
  const worksSnapshot = await sourceCollection.get();

  if (worksSnapshot.empty) {
    log(`No works found in ${sourcePath}`, 'info');
    return true;
  }

  let migrated = 0;
  let failed = 0;

  // Migrate in batches
  for (let i = 0; i < worksSnapshot.docs.length; i += MIGRATION_CONFIG.batchSize) {
    const batch = worksSnapshot.docs.slice(i, i + MIGRATION_CONFIG.batchSize);
    const writeBatch = db.batch();

    for (const doc of batch) {
      const workData = doc.data();

      // Check if already migrated
      const existingDoc = await worksRef.where('userId', '==', userId)
        .where('name', '==', workData.name || workData.platform || '')
        .limit(1)
        .get();

      if (!existingDoc.empty) {
        migrationStats.skippedDocuments++;
        continue;
      }

      // Add userId and type fields
      const newWorkData = {
        ...workData,
        userId: userId,
        type: type,
        migratedAt: new Date(),
      };

      const docRef = worksRef.doc();
      writeBatch.set(docRef, newWorkData);
    }

    try {
      if (!MIGRATION_CONFIG.dryRun) {
        await writeBatch.commit();
      }
      migrated += batch.length;

      if (MIGRATION_CONFIG.verbose) {
        const progress = Math.round((migrated / worksSnapshot.size) * 100);
        log(`Works progress: ${migrated}/${worksSnapshot.size} (${progress}%)`, 'progress');
      }
    } catch (error) {
      log(`Batch migration failed: ${error.message}`, 'error');
      failed += batch.length;
      migrationStats.failedDocuments += failed;
    }
  }

  migrationStats.migratedWorks += migrated;

  if (migrated > 0) {
    log(`✓ Successfully migrated ${migrated} works from ${sourcePath}`, 'success');
  } else {
    log(`All works skipped from ${sourcePath} (already migrated)`, 'info');
  }

  return failed === 0;
}

/**
 * Migrate shifts from user subcollection to root collection
 */
async function migrateUserShifts(userId, subcollectionName, type) {
  const sourcePath = `users/${userId}/${subcollectionName}`;
  const shiftsRef = db.collection('shifts');

  log(`Migrating shifts from ${sourcePath} (${type})`, 'progress');

  // Backup if enabled
  if (MIGRATION_CONFIG.backupBeforeMigration && !MIGRATION_CONFIG.dryRun) {
    try {
      await backupCollection(sourcePath, Date.now());
    } catch (error) {
      log(`Backup failed for ${sourcePath}: ${error.message}`, 'error');
      return false;
    }
  }

  // Get all shifts
  const sourceCollection = db.collection(sourcePath);
  const shiftsSnapshot = await sourceCollection.get();

  if (shiftsSnapshot.empty) {
    log(`No shifts found in ${sourcePath}`, 'info');
    return true;
  }

  let migrated = 0;
  let failed = 0;

  // Migrate in batches
  for (let i = 0; i < shiftsSnapshot.docs.length; i += MIGRATION_CONFIG.batchSize) {
    const batch = shiftsSnapshot.docs.slice(i, i + MIGRATION_CONFIG.batchSize);
    const writeBatch = db.batch();

    for (const doc of batch) {
      const shiftData = doc.data();

      // Get a valid date value for duplicate checking
      const dateValue = shiftData.date || shiftData.startDate;

      // Skip if no valid date
      if (!dateValue) {
        log(`Skipping shift with no date`, 'warning');
        continue;
      }

      // Check if already migrated - use only basic fields to avoid undefined errors
      const existingQuery = shiftsRef.where('userId', '==', userId)
        .where('date', '==', dateValue)
        .where('type', '==', type)
        .limit(1);

      const existingDoc = await existingQuery.get();

      if (!existingDoc.empty) {
        migrationStats.skippedDocuments++;
        continue;
      }

      // Add userId and type fields
      const newShiftData = {
        ...shiftData,
        userId: userId,
        type: type,
        migratedAt: new Date(),
      };

      const docRef = shiftsRef.doc();
      writeBatch.set(docRef, newShiftData);
    }

    try {
      if (!MIGRATION_CONFIG.dryRun) {
        await writeBatch.commit();
      }
      migrated += batch.length;

      if (MIGRATION_CONFIG.verbose) {
        const progress = Math.round((migrated / shiftsSnapshot.size) * 100);
        log(`Shifts progress: ${migrated}/${shiftsSnapshot.size} (${progress}%)`, 'progress');
      }
    } catch (error) {
      log(`Batch migration failed: ${error.message}`, 'error');
      failed += batch.length;
      migrationStats.failedDocuments += failed;
    }
  }

  migrationStats.migratedShifts += migrated;

  if (migrated > 0) {
    log(`✓ Successfully migrated ${migrated} shifts from ${sourcePath}`, 'success');
  } else {
    log(`All shifts skipped from ${sourcePath} (already migrated)`, 'info');
  }

  return failed === 0;
}

/**
 * Migrate all user data
 */
async function migrateUserData(userId) {
  log(`\n=== Migrating user ${userId} ===`, 'info');

  migrationStats.totalUsers++;

  let successCount = 0;

  // Migrate regular works
  const worksSuccess = await migrateUserWorks(userId, 'works', 'regular');
  if (worksSuccess) successCount++;

  // Migrate regular shifts
  const shiftsSuccess = await migrateUserShifts(userId, 'shifts', 'regular');
  if (shiftsSuccess) successCount++;

  // Migrate delivery works
  const deliveryWorksSuccess = await migrateUserWorks(userId, 'works-delivery', 'delivery');
  if (deliveryWorksSuccess) successCount++;

  // Migrate delivery shifts
  const deliveryShiftsSuccess = await migrateUserShifts(userId, 'shifts-delivery', 'delivery');
  if (deliveryShiftsSuccess) successCount++;

  log(`User ${userId}: ${successCount}/4 collections migrated`, 'success');
  return successCount;
}

/**
 * Get all users
 */
async function getAllUsers() {
  log('Fetching all users...', 'info');

  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];

    usersSnapshot.forEach(doc => {
      users.push(doc.id);
    });

    log(`Found ${users.length} users`, 'info');
    return users;
  } catch (error) {
    // Handle case where collection doesn't exist (empty database)
    if (error.code === 5 || error.message.includes('NOT_FOUND')) {
      log('Users collection does not exist - database appears to be empty', 'info');
      log('No migration needed - you can start with the new structure', 'success');
      return [];
    }
    throw error;
  }
}

/**
 * Delete old data after successful migration
 */
async function deleteOldData(userId) {
  log(`\n=== Deleting old data for user ${userId} ===`, 'warning');

  const subcollections = ['works', 'shifts', 'works-delivery', 'shifts-delivery'];
  let deletedCount = 0;

  for (const subcollection of subcollections) {
    const sourcePath = `users/${userId}/${subcollection}`;
    const sourceCollection = db.collection(sourcePath);

    const snapshot = await sourceCollection.get();

    if (!snapshot.empty) {
      const batch = db.batch();
      let batchCount = 0;

      for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        batchCount++;

        if (batchCount >= MIGRATION_CONFIG.batchSize) {
          await batch.commit();
          deletedCount += batchCount;
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
        deletedCount += batchCount;
      }

      log(`Deleted ${deletedCount} documents from ${sourcePath}`, 'success');
    }
  }

  return deletedCount;
}

/**
 * Main migration function
 */
async function runMigration() {
  log('\n' + '='.repeat(70), 'info');
  log('FIRESTORE RESTRUCTURE MIGRATION: NESTED -> FLATTENED FOR KPIS', 'info');
  log('='.repeat(70), 'info');

  migrationStats.startTime = new Date();

  if (MIGRATION_CONFIG.dryRun) {
    log('⚠️ DRY RUN MODE - No actual changes will be made', 'warning');
  }

  try {
    // 1. Get all users
    const users = await getAllUsers();

    if (users.length === 0) {
      log('\n' + '='.repeat(70), 'info');
      log('NO MIGRATION NEEDED', 'info');
      log('='.repeat(70), 'info');
      log('✅ Database is empty or users collection does not exist', 'success');
      log('\nYou can now use the new structure directly!', 'success');
      log('\nNext steps:', 'info');
      log('1. Deploy new application files (firebaseService.js, Contexts)', 'info');
      log('2. Start using the app - it will automatically use the new structure', 'info');
      log('3. No migration needed - starting fresh!', 'success');
      log('='.repeat(70), 'info');
      return;
    }

    // 2. Migrate each user's data
    let userSuccessCount = 0;
    for (const userId of users) {
      const success = await migrateUserData(userId);
      if (success === 4) userSuccessCount++;
    }

    // 3. Delete old data if configured
    if (MIGRATION_CONFIG.deleteOldData && !MIGRATION_CONFIG.dryRun) {
      log('\n=== Deleting old data ===', 'info');
      for (const userId of users) {
        await deleteOldData(userId);
      }
    }

    // 4. Final statistics
    migrationStats.endTime = new Date();
    const duration = (migrationStats.endTime - migrationStats.startTime) / 1000;

    log('\n' + '='.repeat(70), 'info');
    log('MIGRATION SUMMARY', 'info');
    log('='.repeat(70), 'info');
    log(`Users processed: ${migrationStats.totalUsers}`, 'info');
    log(`Users fully migrated: ${userSuccessCount}/${migrationStats.totalUsers}`, 'success');
    log(`Total works migrated: ${migrationStats.migratedWorks}`, 'success');
    log(`Total shifts migrated: ${migrationStats.migratedShifts}`, 'success');
    log(`Documents skipped (already migrated): ${migrationStats.skippedDocuments}`, 'info');
    log(`Documents failed: ${migrationStats.failedDocuments}`, migrationStats.failedDocuments > 0 ? 'error' : 'success');
    log(`Duration: ${duration.toFixed(2)} seconds`, 'info');
    log('='.repeat(70), 'info');

    if (migrationStats.failedDocuments === 0) {
      log('✅ MIGRATION COMPLETED SUCCESSFULLY!', 'success');
      log('\nNext steps:', 'info');
      log('1. Verify data in Firebase Console (check works/ and shifts/ collections)', 'info');
      log('2. Test the application thoroughly', 'info');
      log('3. If everything works, run again with deleteOldData: true', 'info');
      log('4. Deploy the updated application', 'info');
    } else if (migrationStats.failedDocuments > 0) {
      log('⚠️ MIGRATION COMPLETED WITH ERRORS', 'warning');
      log('Please review the logs above for details', 'info');
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

module.exports = { runMigration, migrationStats };