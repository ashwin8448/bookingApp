import { useState } from "react";
import SlotSelectorWrapper from "./styles";

const provider1 = {
  availability: [
    {
      start: "09:00",
      end: "13:00",
    },
    {
      start: "14:00",
      end: "15:45",
    },
    {
      start: "16:00",
      end: "18:00",
    },
  ],

  services: {
    hairCut: {
      cost: 100,
      timeTakenInMinutes: 30,
    },
    hairColor: {
      cost: 200,
      timeTakenInMinutes: 60,
    },
    hairWashing: {
      cost: 500,
      timeTakenInMinutes: 90,
    },
  },
};

const getHours = (time: Date) => {
  return time.getHours().toString().padStart(2, "0");
};

const getMinutes = (time: Date) => {
  return time.getMinutes().toString().padStart(2, "0");
};

const getHoursMinutesFromTimestamp = (timestamp: Date) => {
  return `${getHours(timestamp)}:${getMinutes(timestamp)}`;
};

const getSlots = (
  availabilityStartTime: string,
  availabilityEndTime: string,
  serviceDuration: number
) => {
  const availabilityStartTimestamp = new Date(
    `1970-01-01T${availabilityStartTime}:00`
  );
  const availabilityEndTimestamp = new Date(
    `1970-01-01T${availabilityEndTime}:00`
  );
  let slotStartTimestamp = availabilityStartTimestamp;
  let slotEndTimestamp: Date;
  const slots: { startTimestamp: Date; endTimestamp: Date }[] = [];
  while (true) {
    slotEndTimestamp = new Date(
      slotStartTimestamp.getTime() + serviceDuration * 60 * 1000
    );
    if (slotEndTimestamp <= availabilityEndTimestamp) {
      slots.push({
        startTimestamp: slotStartTimestamp,
        endTimestamp: slotEndTimestamp,
      });
      slotStartTimestamp = slotEndTimestamp;
    } else break;
  }
  return slots;
};

const getProviderSlots = (providerData: typeof provider1) => {
  let serviceSlots:
    | Record<
        keyof typeof providerData.services,
        { startTimestamp: Date; endTimestamp: Date }[]
      >
    | object = {};
  Object.keys(providerData.services).forEach((service) => {
    serviceSlots = {
      ...serviceSlots,
      [service]: providerData.availability.reduce<
        { startTimestamp: Date; endTimestamp: Date }[]
      >((accumulatedSlots, shift) => {
        return [
          ...accumulatedSlots,
          ...getSlots(
            shift.start,
            shift.end,
            providerData.services[service as keyof typeof providerData.services]
              .timeTakenInMinutes
          ),
        ];
      }, []),
    };
  });
  return serviceSlots as Record<
    "hairCut" | "hairColor" | "hairWashing",
    { startTimestamp: Date; endTimestamp: Date }[]
  >;
};

const SlotSelector = () => {
  const [selectedSlots, setSelectedSlots] = useState<
    Record<
      keyof typeof provider1.services,
      { startTimestamp: Date; endTimestamp: Date }
    >
  >({});
  console.log(selectedSlots);
  const providerSlots = getProviderSlots(provider1);
  return (
    <SlotSelectorWrapper>
      {Object.keys(providerSlots).map((serviceName) => {
        return (
          <div className="service-container" key={serviceName}>
            <p>{serviceName}</p>:
            <ul className="slots-container">
              {providerSlots[serviceName as keyof typeof providerSlots].map(
                (slot) => {
                  return (
                    <li
                      onClick={() =>
                        setSelectedSlots((prev) => {
                          return { ...prev, [serviceName]: slot };
                        })
                      }
                      className={
                        Object.keys(selectedSlots).includes(serviceName) &&
                        selectedSlots[
                          serviceName as keyof typeof selectedSlots
                        ].startTimestamp.getTime() ===
                          slot.startTimestamp.getTime()
                          ? "selected"
                          : Object.values(selectedSlots).some(
                              (selectedSlot) =>
                                slot.endTimestamp.getTime() >
                                  selectedSlot.startTimestamp.getTime() &&
                                slot.startTimestamp.getTime() <
                                  selectedSlot.endTimestamp.getTime()
                            )
                          ? "conflict"
                          : ""
                      }
                      style={
                        serviceName === "hairCut"
                          ? { width: "100px" }
                          : serviceName === "hairColor"
                          ? { width: "210px" }
                          : { width: "320px" }
                      }
                    >
                      {getHoursMinutesFromTimestamp(slot.startTimestamp)} -{" "}
                      {getHoursMinutesFromTimestamp(slot.endTimestamp)}
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        );
      })}
    </SlotSelectorWrapper>
  );
};

export default SlotSelector;
