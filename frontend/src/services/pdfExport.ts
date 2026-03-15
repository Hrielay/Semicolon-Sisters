import type { HolidayPlan, Message } from '@/types/chat'

export function generatePDFContent(plan: HolidayPlan, messages: Message[]): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #1976D2;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1976D2;
      margin: 0;
      font-size: 28px;
    }
    .header p {
      color: #666;
      margin: 10px 0 0 0;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      color: #1976D2;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .info-value {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .route-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      background: #fafafa;
    }
    .route-card.selected {
      border-color: #1976D2;
      background: #E3F2FD;
    }
    .route-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .route-type {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .route-type.flight { background: #BBDEFB; color: #1565C0; }
    .route-type.train { background: #C8E6C9; color: #2E7D32; }
    .route-type.bus { background: #FFF9C4; color: #F9A825; }
    .route-type.car { background: #F3E5F5; color: #7B1FA2; }
    .route-price {
      font-size: 18px;
      font-weight: bold;
      color: #1976D2;
    }
    .route-details {
      font-size: 14px;
      color: #555;
    }
    .budget-summary {
      background: linear-gradient(135deg, #1976D2, #2196F3);
      color: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
    }
    .budget-total {
      font-size: 36px;
      font-weight: bold;
    }
    .chat-history {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 2px solid #ddd;
    }
    .message {
      margin-bottom: 15px;
      padding: 12px;
      border-radius: 8px;
    }
    .message.user {
      background: #E3F2FD;
      border-left: 4px solid #1976D2;
    }
    .message.assistant {
      background: #F5F5F5;
      border-left: 4px solid #4CAF50;
    }
    .message-role {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌴 Holiday Plan</h1>
    <p>Generated on ${date}</p>
  </div>

  <div class="section">
    <div class="section-title">📍 Destination & Dates</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Destination</div>
        <div class="info-value">${plan.destination}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Travel Period</div>
        <div class="info-value">${plan.dates.start} - ${plan.dates.end}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🚗 Route Options</div>
    ${plan.routes
      .map(
        (route) => `
      <div class="route-card ${plan.selectedRoute?.id === route.id ? 'selected' : ''}">
        <div class="route-header">
          <span class="route-type ${route.type}">${route.type}</span>
          <span class="route-price">${route.price} ${plan.budget.currency}</span>
        </div>
        <div class="route-details">
          <strong>${route.departure}</strong> → <strong>${route.arrival}</strong><br>
          Duration: ${route.duration}
          ${route.seats.length > 0 ? `<br>Available seats: ${route.seats.filter((s) => s.available).length}` : ''}
        </div>
        ${plan.selectedRoute?.id === route.id ? '<div style="margin-top: 10px; color: #1976D2; font-weight: bold;">✓ Selected</div>' : ''}
      </div>
    `,
      )
      .join('')}
  </div>

  <div class="section">
    <div class="section-title">💰 Budget Summary</div>
    <div class="budget-summary">
      <div class="budget-total">${plan.budget.total} ${plan.budget.currency}</div>
      <div>Total Estimated Cost</div>
    </div>
  </div>

  <div class="chat-history">
    <div class="section-title">💬 Chat History</div>
    ${messages
      .map(
        (msg) => `
      <div class="message ${msg.role}">
        <div class="message-role">${msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'}</div>
        <div>${msg.content}</div>
      </div>
    `,
      )
      .join('')}
  </div>

  <div class="footer">
    <p>Generated by Holiday Planning AI Agent</p>
  </div>
</body>
</html>
  `

  return content
}

export function downloadPDF(plan: HolidayPlan, messages: Message[]): void {
  const htmlContent = generatePDFContent(plan, messages)
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `holiday-plan-${new Date().toISOString().split('T')[0]}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// For actual PDF generation, you can use browser's print functionality
export function printPDF(): void {
  window.print()
}
