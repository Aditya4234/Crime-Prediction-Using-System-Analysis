import { MongoClient, Db, Collection } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://adityagupta200807_db_user:xuASx8HQHvUXEetz@cluster0.vg4l7i7.mongodb.net/';
const MONGODB_DB = process.env.MONGODB_DB || 'cpas_database';

let client: MongoClient | null = null;
let db: Db | null = null;

interface Database {
  users: any[];
  incidents: any[];
  alerts: any[];
  units: any[];
  messages: any[];
  stats: any;
}

const defaultData: Database = {
  users: [
    {
      id: "usr-001",
      username: "admin",
      email: "admin@cpas.gov",
      password: "$2a$10$hashedpassword",
      fullName: "Commander Rajesh Kumar",
      badge: "CMD-001",
      role: "commander",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr-002",
      username: "officer",
      email: "officer@cpas.gov",
      password: "$2a$10$hashedpassword",
      fullName: "Ofc. Amit Sharma",
      badge: "OFC-002",
      role: "officer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  incidents: [
    { id: "CP-2025-0982", type: "Armed Robbery", status: "active", severity: "critical", date: "2025-09-20", location: "142 Main St", victim: "John Smith", suspect: "Unknown Male, 6'0\", dark clothing", officer: "Ofc. Martinez", evidence: 3, witnesses: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "CP-2025-0981", type: "Assault", status: "investigating", severity: "high", date: "2025-09-20", location: "88 Market Ave", victim: "Sarah Connor", suspect: "Known associate", officer: "Ofc. Johnson", evidence: 5, witnesses: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "CP-2025-0980", type: "Burglary", status: "investigating", severity: "medium", date: "2025-09-19", location: "2200 Oak Blvd", victim: "Tech Corp Inc.", suspect: "Pending review", officer: "Ofc. Patel", evidence: 2, witnesses: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "CP-2025-0979", type: "Grand Theft Auto", status: "closed", severity: "medium", date: "2025-09-19", location: "780 Parking Deck B", victim: "Mike Wilson", suspect: "Arrested — D. Jones", officer: "Ofc. Chen", evidence: 8, witnesses: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "CP-2025-0978", type: "Vandalism", status: "closed", severity: "low", date: "2025-09-18", location: "450 School Rd", victim: "Lincoln High", suspect: "Juvenile suspects", officer: "Ofc. Garcia", evidence: 1, witnesses: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "CP-2025-0977", type: "Domestic Disturbance", status: "resolved", severity: "high", date: "2025-09-18", location: "310 Elm Ave", victim: "Confidential", suspect: "Known", officer: "Ofc. Thompson", evidence: 4, witnesses: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  alerts: [
    { id: "ALT-001", code: "CODE-3", type: "ARMED ROBBERY", location: "142 Main St, Downtown", priority: "critical", status: "responding", units: ["UNIT-22", "UNIT-05"], time: "2 min ago", dispatchedAt: new Date(Date.now() - 120000).toISOString() },
    { id: "ALT-002", code: "CODE-2", type: "ASSAULT IN PROGRESS", location: "88 Market Ave", priority: "high", status: "responding", units: ["UNIT-14"], time: "5 min ago", dispatchedAt: new Date(Date.now() - 300000).toISOString() },
    { id: "ALT-003", code: "CODE-1", type: "BURGLARY ALARM", location: "2200 Oak Blvd", priority: "medium", status: "contained", units: ["UNIT-07"], time: "12 min ago", dispatchedAt: new Date(Date.now() - 720000).toISOString() },
    { id: "ALT-004", code: "CODE-3", type: "SHOTS FIRED", location: "55 Pine St, Sector 7", priority: "critical", status: "responding", units: ["UNIT-31", "SWAT-A"], time: "18 min ago", dispatchedAt: new Date(Date.now() - 1080000).toISOString() },
    { id: "ALT-005", code: "CODE-2", type: "DOMESTIC DISTURBANCE", location: "310 Elm Ave", priority: "high", status: "contained", units: ["UNIT-19"], time: "22 min ago", dispatchedAt: new Date(Date.now() - 1320000).toISOString() },
    { id: "ALT-006", code: "CODE-1", type: "VEHICLE THEFT", location: "780 Parking Deck B", priority: "medium", status: "resolved", units: ["UNIT-28"], time: "35 min ago", dispatchedAt: new Date(Date.now() - 2100000).toISOString() },
  ],
  units: [
    { id: "UNIT-14", officer: "Ofc. Martinez", status: "patrol", zone: "A7", battery: 87, signal: "strong" },
    { id: "UNIT-22", officer: "Ofc. Johnson", status: "responding", zone: "C3", battery: 62, signal: "strong" },
    { id: "UNIT-07", officer: "Ofc. Patel", status: "standby", zone: "B12", battery: 95, signal: "strong" },
    { id: "UNIT-31", officer: "Ofc. Chen", status: "patrol", zone: "D5", battery: 78, signal: "medium" },
    { id: "SWAT-A", officer: "Sgt. Williams", status: "staging", zone: "A7", battery: 100, signal: "strong" },
    { id: "UNIT-19", officer: "Ofc. Garcia", status: "patrol", zone: "E9", battery: 45, signal: "weak" },
    { id: "UNIT-05", officer: "Ofc. Thompson", status: "responding", zone: "A7", battery: 71, signal: "strong" },
    { id: "UNIT-28", officer: "Ofc. Lee", status: "standby", zone: "F2", battery: 88, signal: "strong" },
  ],
  messages: [
    { id: 1, from: "UNIT-22", msg: "Arriving at scene, 142 Main St. Perp fled on foot northbound.", time: "15:23", priority: "high" },
    { id: 2, from: "DISPATCH", msg: "All units be advised: Code-3 in Sector 7. Shots reported.", time: "15:18", priority: "critical" },
    { id: 3, from: "UNIT-14", msg: "Copy, proceeding to backup UNIT-22. ETA 2 min.", time: "15:20", priority: "normal" },
    { id: 4, from: "SWAT-A", msg: "Staging at Station 4, awaiting further instructions.", time: "15:15", priority: "normal" },
    { id: 5, from: "UNIT-31", msg: "Patrol complete Zone-D5. No incidents. Returning to sector.", time: "15:10", priority: "normal" },
    { id: 6, from: "UNIT-05", msg: "Backed up UNIT-22. Setting perimeter on Oak and Main.", time: "15:23", priority: "high" },
  ],
  stats: {
    totalIncidents: 270,
    clearanceRate: 80,
    avgResponseTime: 4.2,
    activeUnits: 42,
    alertsActive: 3,
    modelAccuracy: 94.2,
    riskLevel: "HIGH",
    uptime: "99.97%",
  }
};

async function connectToMongo(): Promise<Db> {
  if (db) return db;
  
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(MONGODB_DB);
  console.log('Connected to MongoDB Atlas');
  return db;
}

async function seedDatabase(database: Db): Promise<void> {
  const collections = Object.keys(defaultData) as (keyof Database)[];
  
  for (const collectionName of collections) {
    const collection = database.collection(collectionName);
    const count = await collection.countDocuments();
    
    if (count === 0) {
      const data = defaultData[collectionName];
      if (Array.isArray(data)) {
        await collection.insertMany(data);
      } else {
        await collection.insertOne({ _id: 'stats', ...data });
      }
      console.log(`Seeded ${collectionName} collection`);
    }
  }
}

export async function getCollection<K extends keyof Database>(collection: K): Promise<Database[K]> {
  const database = await connectToMongo();
  const col = database.collection(collection);
  
  if (collection === 'stats') {
    const doc = await col.findOne({ _id: 'stats' });
    if (doc) {
      const { _id, ...stats } = doc;
      return stats as Database[K];
    }
    return defaultData.stats as Database[K];
  }
  
  const documents = await col.find({}).toArray();
  return documents.map(doc => {
    const { _id, ...rest } = doc;
    return rest;
  }) as Database[K];
}

export async function updateCollection<K extends keyof Database>(collection: K, data: Database[K]): Promise<void> {
  const database = await connectToMongo();
  const col = database.collection(collection);
  
  if (collection === 'stats') {
    await col.updateOne(
      { _id: 'stats' },
      { $set: data },
      { upsert: true }
    );
    return;
  }
  
  await col.deleteMany({});
  if (Array.isArray(data) && data.length > 0) {
    await col.insertMany(data);
  }
}

export async function initializeDatabase(): Promise<void> {
  const database = await connectToMongo();
  await seedDatabase(database);
}

export function readDb(): Database {
  throw new Error('readDb is deprecated. Use getCollection() instead.');
}

export function writeDb(data: Database): void {
  throw new Error('writeDb is deprecated. Use updateCollection() instead.');
}
