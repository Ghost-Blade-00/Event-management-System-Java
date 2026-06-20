package com.eventmgmt.dto;
import lombok.Data;
@Data public class DashboardResponse {
    public long totalEvents;
    public long publishedEvents;
    public long upcomingEvents;
    public long totalRegistrations;
    public long totalUsers;
    public double avgFillRate;
}
