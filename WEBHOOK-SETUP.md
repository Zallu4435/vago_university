# 🔗 GitHub Webhook Setup Guide

## 📋 **Your ngrok URL:**
```
https://6055e25f8f06.ngrok-free.app
```

## 🚀 **Step-by-Step Webhook Setup:**

### **1. Go to GitHub Repository:**
- Visit: https://github.com/Zallu4435/vago_university
- Click **"Settings"** tab
- Click **"Webhooks"** in the left sidebar

### **2. Add New Webhook:**
- Click **"Add webhook"** button
- Configure the webhook:

#### **Payload URL:**
```
https://6055e25f8f06.ngrok-free.app/github-webhook/
```

#### **Content type:**
```
application/json
```

#### **Secret:**
```
(leave empty for now)
```

#### **Events:**
- Select **"Just the push event"**
- ✅ **Active** (checked)

### **3. Click "Add webhook"**

## 🔧 **Configure Jenkins Job:**

### **1. In Jenkins:**
- Go to your multibranch pipeline job: `university-management-platform`
- Click **"Configure"**
- Scroll down to **"Build Triggers"** section
- ✅ **Check "GitHub hook trigger for GITScm polling"**
- Click **"Save"**

## 🧪 **Test the Webhook:**

### **1. Push a test commit:**
```bash
git add .
git commit -m "Test webhook automatic trigger"
git push origin responsive
```

### **2. What should happen:**
- ✅ **GitHub detects the push**
- ✅ **GitHub sends webhook to Jenkins**
- ✅ **Jenkins automatically starts building**
- ✅ **No manual "Scan Now" needed**

### **3. Monitor:**
- **GitHub:** Check Settings → Webhooks for delivery status
- **Jenkins:** Should automatically start building
- **Build Log:** Should show "Started by GitHub push"

## 🔍 **Troubleshooting:**

### **If webhook doesn't work:**
1. **Check ngrok is running:** `ps aux | grep ngrok`
2. **Check webhook delivery:** GitHub Settings → Webhooks → Click on webhook → Recent Deliveries
3. **Check Jenkins logs:** Jenkins → Manage Jenkins → System Log
4. **Verify URL:** Make sure the webhook URL ends with `/github-webhook/`

### **If Jenkins doesn't trigger:**
1. **Check Build Triggers:** Make sure "GitHub hook trigger for GITScm polling" is checked
2. **Check Jenkins logs:** Look for webhook-related errors
3. **Test manually:** Try "Scan Now" to ensure job works

---

**🎉 Once set up, every push to GitHub will automatically trigger Jenkins!** 