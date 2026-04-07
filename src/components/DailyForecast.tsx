type dailyProps = {
    daily: { day: string; tempDay: number; tempNight: number; icon: string }[];
    getIconUrl: (icon: string) => string;
};

export function DailyForecast({ daily, getIconUrl }: dailyProps) {
    return (
        <div className="daily-forecast">
            {daily.map((d, i) => (
                <div key={i} className="daily-item">
                    <span className="day-name">{d.day}</span>
                    <div className="daily-temp">
                        <img src={getIconUrl(d.icon)} alt="icon" width="30"/>
                        <span>+{d.tempDay}°</span>
                        <span className="night-temp">+{d.tempNight}°</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
