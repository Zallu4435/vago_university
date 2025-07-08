import { DomainError } from '../../auth/errors/AuthErrors';

export class DashboardDataNotFoundError extends DomainError {
  constructor(message: string = 'Dashboard data not found.') {
    super(message, 'DashboardDataNotFoundError');
  }
}

export class DashboardMetricsError extends DomainError {
  constructor(message: string = 'Failed to fetch dashboard metrics.') {
    super(message, 'DashboardMetricsError');
  }
}

export class DashboardUserGrowthError extends DomainError {
  constructor(message: string = 'Failed to fetch user growth data.') {
    super(message, 'DashboardUserGrowthError');
  }
}

export class DashboardRevenueError extends DomainError {
  constructor(message: string = 'Failed to fetch revenue data.') {
    super(message, 'DashboardRevenueError');
  }
}

export class DashboardPerformanceError extends DomainError {
  constructor(message: string = 'Failed to fetch performance data.') {
    super(message, 'DashboardPerformanceError');
  }
}

export class DashboardActivitiesError extends DomainError {
  constructor(message: string = 'Failed to fetch recent activities.') {
    super(message, 'DashboardActivitiesError');
  }
}

export class DashboardAlertsError extends DomainError {
  constructor(message: string = 'Failed to fetch system alerts.') {
    super(message, 'DashboardAlertsError');
  }
}

export class DashboardDismissAlertError extends DomainError {
  constructor(message: string = 'Failed to dismiss alert.') {
    super(message, 'DashboardDismissAlertError');
  }
}

export class DashboardMarkActivityError extends DomainError {
  constructor(message: string = 'Failed to mark activity as read.') {
    super(message, 'DashboardMarkActivityError');
  }
} 