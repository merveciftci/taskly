import { DatePicker } from "antd";
import moment from "moment";
import "./Upcoming.css";
import "moment/locale/tr";
import { useEffect } from "react";
moment.locale("tr");

export const UpcomingHeader = ({
  calendar,
  setCalendar,
  selectedMonthAndYear,
  setSelectedMonthAndYear,
  setDates,
  generateDates,
}) => {
  const handleClick = () => {
    setCalendar(!calendar);
  };

  const handleClickBtn = () => {
    handleClick();
  };

  //month and year calendar btn - HEADER SECTION
  useEffect(() => {
    const today = new Date();
    setSelectedMonthAndYear(moment(today).format("MMMM YYYY"));
    setDates(generateDates(today, 7));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //picking a day from calendar
  const handleDate = (date, dateString) => {
    setCalendar(!calendar);
    if (dateString) {
      const selectedDate = moment(dateString).toDate();

      // takvimden seçilen ay ve yıl
      const formattedDate = moment(dateString).format("MMMM YYYY");
      setSelectedMonthAndYear(formattedDate);
      setDates(generateDates(selectedDate, 7));
    }
  };
  const disabledDate = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };
  const handleTodayClick = () => {
    const todayDate = new Date();
    setDates(generateDates(todayDate, 7));
    const formattedDate = moment(todayDate).format("MMMM YYYY");
    setSelectedMonthAndYear(formattedDate);
  };

  return (
    <div className="upcomingHeaderComponent">
      <div className="upcomingComponent">
        <div className="upcomingTitle">
          <h2 className="componentHeaderTitle">Upcoming</h2>
        </div>
        <div className="dateChanging-container">
          <div className="dateChanging-btn-container">
            <button className="dateChanging-btn" onClick={handleClickBtn}>
              <span className="dateChanging-span">
                {selectedMonthAndYear}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    d="M11.646 5.647a.5.5 0 0 1 .708.707l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 1 1 .708-.707L8 9.294l3.646-3.647Z"
                  ></path>
                </svg>
              </span>
            </button>
            <DatePicker
              onChange={handleDate}
              disabledDate={disabledDate}
              open={calendar}
              style={{
                position: "absolute",
                left: "-50%",
                height: 0,
                padding: 0,
                visibility: "hidden",
              }}
            />
          </div>
          <button className="todayDate-btn" onClick={handleTodayClick}>
            Go to Today
          </button>
        </div>
      </div>
    </div>
  );
};
