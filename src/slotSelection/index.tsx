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

const getSlots = (
  startTime: string,
  endTime: string,
  serviceDuration: number
) => {
  const slots = [];
  const modifiedStartTime = new Date(`1970-01-01T${startTime}:00`);
  const modifiedEndTime = new Date(`1970-01-01T${endTime}:00`);

  while (modifiedStartTime <= modifiedEndTime) {
    const hours = modifiedStartTime.getHours().toString().padStart(2, "0");
    const minutes = modifiedStartTime.getMinutes().toString().padStart(2, "0");
    const timeSlot = `${hours}:${minutes}`;
    slots.push(timeSlot);
    modifiedStartTime.setMinutes(
      modifiedStartTime.getMinutes() + serviceDuration
    );
  }
  return slots;
};

const getProviderSlots = (providerData: typeof provider1) => {
  let serviceSlots = {};
  Object.keys(providerData.services).forEach((service) => {
    serviceSlots = {
      ...serviceSlots,
      [service]: providerData.availability.reduce<string[]>(
        (accumulatedSlots, shift) => {
          return [
            ...accumulatedSlots,
            ...getSlots(
              shift.start,
              shift.end,
              providerData.services[
                service as keyof typeof providerData.services
              ].timeTakenInMinutes
            ),
          ];
        },
        []
      ),
    };
  });
  return serviceSlots;
};

const SlotSelector = () => {
  const providerSlots = getProviderSlots(provider1);
  console.log(providerSlots);
  return (
    <SlotSelectorWrapper>
      {Object.keys(providerSlots).map((serviceName) => {
        return (
          <div className="service-container" key={serviceName}>
            {serviceName}:
            <div className="slots-container">
              {
                // providerSlots[serviceName as keyof typeof providerSlots].map
              }
            </div>
          </div>
        );
      })}
    </SlotSelectorWrapper>
  );
};

export default SlotSelector;
