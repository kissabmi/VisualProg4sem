type hourlyProps = {
    hourly: { time: string; temp: number; icon: string }[];
    getIconUrl: (icon: string) => string;
};

export function HourlyForecast({ hourly, getIconUrl }: hourlyProps) {
    return (
        <div className="hourly-forecast">
            {hourly.map((h, i) => (
                <div key={i} className="hourly-item">
                    <span>{h.time}</span>
                    <img src={getIconUrl(h.icon)} alt="icon" />
                    <span>{h.temp}°</span>
                </div>
            ))}
        </div>
    );
}
