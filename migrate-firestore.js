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
admin.initializeApp(***REMOVED***
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gestionturnos-7ec99.firebaseio.com'
***REMOVED***);

const db = admin.firestore();

// Migration configuration
const MIGRATION_CONFIG = ***REMOVED***
  dryRun: false, // Set to true to test without actually writing
  batchSize: 100,
  verbose: true,
  backupBeforeMigration: true // Optional: Creates backup of old collections
***REMOVED***;

// Collection mappings
const COLLECTION_MAPPINGS = ***REMOVED***
  // User subcollections
  'trabajos': 'works',
  'turnos': 'shifts',
  'trabajos-delivery': 'delivery-works',
  'turnos-delivery': 'delivery-shifts',
  
  // Root collections
  'trabajos_compartidos': 'shared-works',
  'usuarios': 'users'
***REMOVED***;

// Progress tracking
let migrationStats = ***REMOVED***
  totalDocuments: 0,
  migratedDocuments: 0,
  failedDocuments: 0,
  skippedDocuments: 0,
  startTime: null,
  endTime: null
***REMOVED***;

/**
 * Log migration progress
 */
function log(message, type = 'info') ***REMOVED***
  const timestamp = new Date().toISOString();
  const prefix = ***REMOVED***
    'info': 'ℹ️',
    'success': '✅',
    'error': '❌',
    'warning': '⚠️',
    'progress': '🔄'
  ***REMOVED***;
  console.log(`[$***REMOVED***timestamp***REMOVED***] $***REMOVED***prefix[type] || 'ℹ️'***REMOVED*** $***REMOVED***message***REMOVED***`);
***REMOVED***

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) ***REMOVED***
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
***REMOVED***

/**
 * Get all documents from a collection
 */
async function getAllDocuments(collectionRef) ***REMOVED***
  const snapshot = await collectionRef.get();
  const documents = [];
  snapshot.forEach(doc => ***REMOVED***
    documents.push(***REMOVED***
      id: doc.id,
      data: doc.data()
    ***REMOVED***);
  ***REMOVED***);
  return documents;
***REMOVED***

/**
 * Check if collection exists
 */
async function collectionExists(collectionPath) ***REMOVED***
  try ***REMOVED***
    const snapshot = await db.collection(collectionPath).limit(1).get();
    return !snapshot.empty;
  ***REMOVED*** catch (error) ***REMOVED***
    return false;
  ***REMOVED***
***REMOVED***

/**
 * Backup collection to Firestore
 */
async function backupCollection(sourcePath, timestamp) ***REMOVED***
  const backupPath = `$***REMOVED***sourcePath***REMOVED***_backup_$***REMOVED***timestamp***REMOVED***`;
  log(`Creating backup of $***REMOVED***sourcePath***REMOVED*** to $***REMOVED***backupPath***REMOVED***`, 'info');
  
  const sourceCollection = db.collection(sourcePath);
  const backupCollection = db.collection(backupPath);
  
  const documents = await getAllDocuments(sourceCollection);
  migrationStats.totalDocuments += documents.length;
  
  let backedUp = 0;
  const batch = db.batch();
  let batchCount = 0;
  
  for (const doc of documents) ***REMOVED***
    const docRef = backupCollection.doc(doc.id);
    batch.set(docRef, doc.data);
    batchCount++;
    
    if (batchCount >= MIGRATION_CONFIG.batchSize) ***REMOVED***
      await batch.commit();
      backedUp += batchCount;
      batchCount = 0;
      
      if (MIGRATION_CONFIG.verbose) ***REMOVED***
        log(`Backed up $***REMOVED***backedUp***REMOVED***/$***REMOVED***documents.length***REMOVED*** documents`, 'progress');
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
  
  if (batchCount > 0) ***REMOVED***
    await batch.commit();
    backedUp += batchCount;
  ***REMOVED***
  
  log(`Backup completed: $***REMOVED***backedUp***REMOVED*** documents backed up`, 'success');
  return documents.length;
***REMOVED***

/**
 * Migrate documents from source to destination
 */
async function migrateDocuments(sourcePath, destinationPath) ***REMOVED***
  log(`Migrating $***REMOVED***sourcePath***REMOVED*** -> $***REMOVED***destinationPath***REMOVED***`, 'progress');
  
  const sourceCollection = db.collection(sourcePath);
  const destinationCollection = db.collection(destinationPath);
  
  // Check if destination already has data
  const destinationExists = await collectionExists(destinationPath);
  if (destinationExists) ***REMOVED***
    log(`Destination $***REMOVED***destinationPath***REMOVED*** already exists. Checking...`, 'warning');
    const existingDocs = await getAllDocuments(destinationCollection);
    if (existingDocs.length > 0) ***REMOVED***
      log(`Destination has $***REMOVED***existingDocs.length***REMOVED*** documents. Skipping migration.`, 'warning');
      migrationStats.skippedDocuments += existingDocs.length;
      return false;
    ***REMOVED***
  ***REMOVED***
  
  // Get all documents from source
  const documents = await getAllDocuments(sourceCollection);
  
  if (documents.length === 0) ***REMOVED***
    log(`No documents found in $***REMOVED***sourcePath***REMOVED***. Skipping.`, 'info');
    return true;
  ***REMOVED***
  
  migrationStats.totalDocuments += documents.length;
  let migrated = 0;
  let failed = 0;
  
  // Migrate in batches
  for (let i = 0; i < documents.length; i += MIGRATION_CONFIG.batchSize) ***REMOVED***
    const batch = documents.slice(i, i + MIGRATION_CONFIG.batchSize);
    const writeBatch = db.batch();
    
    for (const doc of batch) ***REMOVED***
      const docRef = destinationCollection.doc(doc.id);
      writeBatch.set(docRef, doc.data);
    ***REMOVED***
    
    try ***REMOVED***
      if (!MIGRATION_CONFIG.dryRun) ***REMOVED***
        await writeBatch.commit();
      ***REMOVED***
      migrated += batch.length;
      
      if (MIGRATION_CONFIG.verbose) ***REMOVED***
        const progress = Math.round((migrated / documents.length) * 100);
        log(`Progress: $***REMOVED***migrated***REMOVED***/$***REMOVED***documents.length***REMOVED*** ($***REMOVED***progress***REMOVED***%)`, 'progress');
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      log(`Batch migration failed: $***REMOVED***error.message***REMOVED***`, 'error');
      failed += batch.length;
      migrationStats.failedDocuments += batch.length;
    ***REMOVED***
  ***REMOVED***
  
  migrationStats.migratedDocuments += migrated;
  
  if (migrated === documents.length) ***REMOVED***
    log(`✓ Successfully migrated $***REMOVED***migrated***REMOVED*** documents from $***REMOVED***sourcePath***REMOVED***`, 'success');
  ***REMOVED*** else ***REMOVED***
    log(`⚠ Partial migration: $***REMOVED***migrated***REMOVED***/$***REMOVED***documents.length***REMOVED*** succeeded, $***REMOVED***failed***REMOVED*** failed`, 'warning');
  ***REMOVED***
  
  return migrated === documents.length;
***REMOVED***

/**
 * Migrate all user data
 */
async function migrateUserData(userId) ***REMOVED***
  log(`\n=== Migrating user $***REMOVED***userId***REMOVED*** ===`, 'info');
  
  const userSubcollections = [
    'trabajos',
    'turnos',
    'trabajos-delivery',
    'turnos-delivery'
  ];
  
  let successCount = 0;
  
  for (const subcollection of userSubcollections) ***REMOVED***
    const sourcePath = `usuarios/$***REMOVED***userId***REMOVED***/$***REMOVED***subcollection***REMOVED***`;
    const destinationPath = `users/$***REMOVED***userId***REMOVED***/$***REMOVED***COLLECTION_MAPPINGS[subcollection]***REMOVED***`;
    
    // Backup if enabled
    if (MIGRATION_CONFIG.backupBeforeMigration && !MIGRATION_CONFIG.dryRun) ***REMOVED***
      try ***REMOVED***
        await backupCollection(sourcePath, Date.now());
      ***REMOVED*** catch (error) ***REMOVED***
        log(`Backup failed for $***REMOVED***sourcePath***REMOVED***: $***REMOVED***error.message***REMOVED***`, 'error');
      ***REMOVED***
    ***REMOVED***
    
    // Migrate
    const success = await migrateDocuments(sourcePath, destinationPath);
    if (success) successCount++;
  ***REMOVED***
  
  log(`User $***REMOVED***userId***REMOVED***: $***REMOVED***successCount***REMOVED***/$***REMOVED***userSubcollections.length***REMOVED*** collections migrated`, 'success');
***REMOVED***

/**
 * Migrate root collections
 */
async function migrateRootCollections() ***REMOVED***
  log('\n=== Migrating Root Collections ===', 'info');
  
  const rootCollections = [
    'trabajos_compartidos',
    'usuarios'
  ];
  
  for (const collection of rootCollections) ***REMOVED***
    if (collection === 'usuarios') ***REMOVED***
      // Special handling for users - migrate each user's data
      log('Migrating user collection (will process individual users separately)', 'info');
      continue;
    ***REMOVED***
    
    const sourcePath = collection;
    const destinationPath = COLLECTION_MAPPINGS[collection];
    
    // Backup if enabled
    if (MIGRATION_CONFIG.backupBeforeMigration && !MIGRATION_CONFIG.dryRun) ***REMOVED***
      try ***REMOVED***
        await backupCollection(sourcePath, Date.now());
      ***REMOVED*** catch (error) ***REMOVED***
        log(`Backup failed for $***REMOVED***sourcePath***REMOVED***: $***REMOVED***error.message***REMOVED***`, 'error');
      ***REMOVED***
    ***REMOVED***
    
    await migrateDocuments(sourcePath, destinationPath);
  ***REMOVED***
***REMOVED***

/**
 * Get all users
 */
async function getAllUsers() ***REMOVED***
  log('Fetching all users...', 'info');
  
  const usersSnapshot = await db.collection('usuarios').get();
  const users = [];
  
  usersSnapshot.forEach(doc => ***REMOVED***
    users.push(doc.id);
  ***REMOVED***);
  
  log(`Found $***REMOVED***users.length***REMOVED*** users`, 'info');
  return users;
***REMOVED***

/**
 * Main migration function
 */
async function runMigration() ***REMOVED***
  log('\n' + '='.repeat(60), 'info');
  log('FIRESTORE MIGRATION: SPANISH -> ENGLISH', 'info');
  log('='.repeat(60), 'info');
  
  migrationStats.startTime = new Date();
  
  if (MIGRATION_CONFIG.dryRun) ***REMOVED***
    log('⚠️ DRY RUN MODE - No actual changes will be made', 'warning');
  ***REMOVED***
  
  try ***REMOVED***
    // 1. Migrate root collections (except usuarios)
    await migrateRootCollections();
    
    // 2. Get all users
    const users = await getAllUsers();
    
    if (users.length === 0) ***REMOVED***
      log('No users found to migrate', 'warning');
      return;
    ***REMOVED***
    
    // 3. Migrate each user's data
    let userSuccessCount = 0;
    for (const userId of users) ***REMOVED***
      const success = await migrateUserData(userId);
      if (success) userSuccessCount++;
    ***REMOVED***
    
    // 4. Final statistics
    migrationStats.endTime = new Date();
    const duration = (migrationStats.endTime - migrationStats.startTime) / 1000;
    
    log('\n' + '='.repeat(60), 'info');
    log('MIGRATION SUMMARY', 'info');
    log('='.repeat(60), 'info');
    log(`Total documents processed: $***REMOVED***migrationStats.totalDocuments***REMOVED***`, 'info');
    log(`Documents migrated: $***REMOVED***migrationStats.migratedDocuments***REMOVED***`, 'success');
    log(`Documents failed: $***REMOVED***migrationStats.failedDocuments***REMOVED***`, migrationStats.failedDocuments > 0 ? 'error' : 'success');
    log(`Documents skipped: $***REMOVED***migrationStats.skippedDocuments***REMOVED***`, 'info');
    log(`Users processed: $***REMOVED***users.length***REMOVED***`, 'info');
    log(`Users fully migrated: $***REMOVED***userSuccessCount***REMOVED***/$***REMOVED***users.length***REMOVED***`, 'success');
    log(`Duration: $***REMOVED***duration.toFixed(2)***REMOVED*** seconds`, 'info');
    log('='.repeat(60), 'info');
    
    if (migrationStats.failedDocuments === 0 && migrationStats.migratedDocuments > 0) ***REMOVED***
      log('✅ MIGRATION COMPLETED SUCCESSFULLY!', 'success');
      log('\nNext steps:', 'info');
      log('1. Verify data in Firebase Console', 'info');
      log('2. Test the application thoroughly', 'info');
      log('3. If everything works, delete old collections (see cleanup instructions)', 'info');
    ***REMOVED*** else if (migrationStats.failedDocuments > 0) ***REMOVED***
      log('⚠️ MIGRATION COMPLETED WITH ERRORS', 'warning');
      log('Please review the logs above for details', 'info');
    ***REMOVED*** else ***REMOVED***
      log('ℹ️ No documents were migrated (possibly already done or no data)', 'info');
    ***REMOVED***
    
  ***REMOVED*** catch (error) ***REMOVED***
    log(`❌ MIGRATION FAILED: $***REMOVED***error.message***REMOVED***`, 'error');
    log(`Stack trace: $***REMOVED***error.stack***REMOVED***`, 'error');
    process.exit(1);
  ***REMOVED***
***REMOVED***

// Run the migration
if (require.main === module) ***REMOVED***
  runMigration()
    .then(() => ***REMOVED***
      process.exit(0);
    ***REMOVED***)
    .catch((error) => ***REMOVED***
      log(`Fatal error: $***REMOVED***error.message***REMOVED***`, 'error');
      process.exit(1);
    ***REMOVED***);
***REMOVED***

module.exports = ***REMOVED*** runMigration, migrateDocuments, migrationStats ***REMOVED***;