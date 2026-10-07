// Analytics page functionality
const supabaseUrl = 'https://dqepsuecouvnvozcnjth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgxODY3NCwiZXhwIjoyMTA1Mzk0Njc0fQ.yn1zGz8RIbyPKTkjw8YwTZr5cnTvyvd4Tp5COv046HE';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Display current date
document.addEventListener('DOMContentLoaded', () => {
  const dateElement = document.getElementById('currentDate');
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = now.toLocaleDateString('ar-EG', options);

  loadTicketStatistics();
  loadRecentActivity();
});

// Load ticket statistics
async function loadTicketStatistics() {
  try {
    // Total tickets
    const { count: totalTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true });

    // Open tickets
    const { count: openTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .not('status', 'eq', 'closed');

    // Closed tickets
    const { count: closedTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'closed');

    // Total ratings
    const { count: totalRatings } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true });

    document.getElementById('totalTickets').textContent = totalTickets || 0;
    document.getElementById('openTickets').textContent = openTickets || 0;
    document.getElementById('closedTickets').textContent = closedTickets || 0;
    document.getElementById('totalRatings').textContent = totalRatings || 0;
  } catch (error) {
    console.error('Error loading ticket statistics:', error);
  }
}

// Load recent activity
async function loadRecentActivity() {
  try {
    const { data: tickets } = await supabase
      .from('tickets')
      .select('*, customer:customers(name)')
      .order('created_at', { ascending: false })
      .limit(10);

    const activityList = document.getElementById('recentActivity');

    if (!tickets || tickets.length === 0) {
      activityList.innerHTML = '<p class="empty-state">لا يوجد نشاط حالياً</p>';
      return;
    }

    activityList.innerHTML = tickets.map(ticket => `
      <div class="activity-item">
        <div class="activity-icon">🎫</div>
        <div class="activity-content">
          <div class="activity-title">تذكرة جديدة</div>
          <div class="activity-description">${ticket.customer?.name || 'غير معروف'} - ${ticket.ticket_number}</div>
          <div class="activity-time">${new Date(ticket.created_at).toLocaleString('ar-EG')}</div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading recent activity:', error);
    document.getElementById('recentActivity').innerHTML = '<p class="empty-state">حدث خطأ في التحميل</p>';
  }
}
