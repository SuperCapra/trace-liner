const express = require('express');
const tables = require('./tables');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
// const axios = require('axios');
// const cors = require('cors');
const app = express();
const helmet = require('helmet');
const db = require('./db');
const fs = require('fs');

const roots = [
  '/nama-crew',
  '/mura-sunset-ride',
  '/sem',
];

app.use(express.json());

(async () => {
  await tables.createTables();
})();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
// // enables cors for all routea
// app.use(cors());

// // Route to handle image requests
// app.get('/image-proxy', async (req, res) => {
//   const imageUrl = req.query.url;
  
//   try {
//     // Fetch the image from the external service
//     const response = await axios.get(imageUrl, { responseType: 'stream' });
    
//     // Forward the image back to the client
//     res.setHeader('Content-Type', response.headers['content-type']);
//     response.data.pipe(res);
//   } catch (error) {
//     res.status(500).send('Error fetching image');
//   }
// });

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath); // Store the file in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Proxy route for handling image upload
app.post('/upload',authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // The image was uploaded successfully, now return the URL
  try {
    const imageUrl = req.query.server + `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (e) {
    console.log('Server upload error:', e)
  }
});

// Serve and delete image after download
app.get('/uploads/:filename', authenticateToken, (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  try {
    // navigator.share({
    //   title: req.params.filename,
    //   files: filePath
    // });
    // Send the file for download
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
      }
    });
  } catch (e) {
    console.log(e)
    // Send the file for download
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
      }
    });
  } finally {
    // fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.error('Error deleting the file:', err);
    //   } else {
    //     console.log('File successfully deleted:', req.params.filename);
    //   }
    // });
  }
});

app.post('/delete/:filename', authenticateToken, (req,res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  // console.log('filePath:', req.params.filename)
  // console.log('filePath:', filePath)
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting the file:', err);
    } else {
      console.log('File successfully deleted:', req.params.filename);
    }
  });
})
app.post('/api/editable/:table', authenticateToken, async (req, res) => {
  try {
    const table = req.params.table
    const id = await db.addRecord(req.body, table)
    // console.log('creating record:', table)
    // console.log('creating record id:', id)
    const result = {
      table: table,
      id: id
    }
    res.status(201).json(result)
  } catch (e) {
    console.log('Exception inserting non editable record:', e)
    res.status(500).json({error: e})
  }
})
app.patch('/api/editable/:table/:recordId', authenticateToken, async (req, res) => {
  try {
    const table = req.params.table
    // console.log('modifying record:', table)
    const recordId = req.params.recordId
    const updatedUserId = await db.modifyRecord(req.body, table, recordId)
    const result = {
      table: table,
      id: updatedUserId
    }
    res.status(201).json(result)
  } catch (e) {
    console.log('Exception modifying record:', e)
    res.status(500).json({error: e})
  }
})
app.post('/api/noneditable/:table', authenticateToken, async (req, res) => {
  try {
    const table = req.params.table
    const id = await db.addRecord(req.body, table)
    // console.log('creating record:', table)
    // console.log('creating record id:', id)
    const result = {
      table: table,
      id: id
    }
    res.status(201).json(result)
  } catch (e) {
    console.log('Exception inserting non editable record:', e)
    res.status(500).json({error: e})
  }
})
app.patch('/api/noneditable/:table/:recordId', authenticateToken, async (req, res) => {
  try {
    const table = req.params.table
    const recordId = req.params.recordId
    const updatedUserId = await db.modifyRecord(req.body, table, recordId)
    const result = {
      table: table,
      id: updatedUserId
    }
    res.status(201).json(result)
  } catch (e) {
    console.log('Exception updating non editable record:', e)
    res.status(500).json({error: e})
  }
})
app.post('/api/query', authenticateToken, async (req, res) => {
  try {
    const query = req.body.query
    // console.log('fields:',fields)
    // console.log('Array.isArray(fields):',Array.isArray(fields))
    let records
    if(query) {
      records = await db.getQueryResult(query)
    }
    const result = {
      records: records
    }
    res.status(201).json(result)
  } catch (e) {
    console.log('Exception querying:', e)
    res.status(500).json({error: e})
  }
})
app.get('/api/:table', authenticateToken, async (req, res) => {
  try {
    const table = req.params.table
    const fields = req.body.fields
    const whereClause = req.body.whereClause
    // console.log('fields:',fields)
    // console.log('Array.isArray(fields):',Array.isArray(fields))
    let records
    if(fields && Array.isArray(fields) && fields.length) {
      records = await db.getRecordsFields(table,fields,whereClause)
    } else {
      records = await db.getRecords(table,whereClause)
    }
    const result = {
      table: table,
      recordsNumber: records.length ? records.length : 0,
      records: records
    }
    res.status(201).json(result)
  } catch (e) {
    console.log('Exception querying:', e)
    res.status(500).json({error: e})
  }
})
app.get('/api/:table/:field/:value', authenticateToken, async (req, res) => {
  try {
    const table = req.params.table
    const fields = req.body.fields
    const field = req.params.field
    const value = req.params.value
    let record
    if(fields && Array.isArray(fields) && fields.length) {
      record = await db.getRecordFields(table,fields,field,value)
    } else {
      record = await db.getRecord(table,field,value)
    }
    const result = {
      table: table,
      recordsNumber: record ? 1 : 0,
      record: record
    }
    res.status(201).json(result)
  } catch (e) {
    console.log('Exception querying:', e)
    res.status(500).json({error: e})
  }
})

app.post('/api/salesforce-login-and-upsert', authenticateToken, async (req, res) => {
  const { username, password, securityToken, clientId, clientSecret, externalId, object, field, body } = req.body;

  // Step 1: Get the access token by logging in to Salesforce
  const loginUrl = `https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=${clientId}&client_secret=${clientSecret}&username=${username}&password=${password}${securityToken}`;

  try {
    // Perform the login request to Salesforce
    const loginResponse = await fetch(loginUrl, { method: 'POST' });
    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      throw new Error(`Salesforce login failed: ${loginData.error_description}`);
    }

    const accessToken = loginData.access_token;
    const instanceUrlFromLogin = loginData.instance_url;
    
    // Step 2: Perform the upsert using the access token obtained
    const upsertUrl = `${instanceUrlFromLogin}/services/data/v50.0/sobjects/${object}/${field}/${externalId}`;

    // console.log('upsertUrl', upsertUrl)
    // console.log('body', body)

    const upsertResponse = await fetch(upsertUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: body,
    });

    const upsertData = await upsertResponse.json();
    // console.log('upsertData:', upsertData)
    if (!upsertResponse.ok) {
      throw new Error(`Salesforce upsert failed: ${upsertData.message}`);
    }

    console.log('Upsert Response:', upsertData);

    // Send the upsert response back to the client
    res.json(upsertData);

  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error in Salesforce login and upsert process', details: error.message });
  }
});


// Use Helmet to set various security headers
app.use(helmet());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://www.strava.com","https://login.salesforce.com"],
        imgSrc: ["'self'","*","data:"],
      }
    }
  })
);

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', "web-share=*");
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// The "catchall" handler: for any request that doesn't match,
// send back the index.html from the React app.
roots.forEach(rootKey => {
  app.get([rootKey, `${rootKey}/visitId-:id`], (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
  let rootAdmin = '/admin' + rootKey
  app.get([rootAdmin, `${rootAdmin}/visitId-:id`], (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
})

app.get('/visitId-:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.get('/statistics', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// app.get('/api/strava_webhook', (req, res) => {
//   res.json({ 'hub.mode': 'subscribe','hub.challenge': 'oN6G8xMkPNrJtTd3PRohCLXjJLHxLpymJJwWpDza','hub.verify_token': 'STRAVA_BEAUTYLINER'});
// })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});