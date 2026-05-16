// Simulerar realtidsdata för alla enheter i hemmet.
// Sim-tid går 60x snabbare än verklig tid så cykler blir synliga under en demo.

const SIM_SPEED = 60

const ROBOT_ROOMS = ['Vardagsrum', 'Kök', 'Hall', 'Sovrum', 'Kontor']
const WASH_PROGRAMS = ['Bomull 40°', 'Snabb 30°', 'Ull 30°', 'Kulört 60°']
const DISH_PROGRAMS = ['Eco', 'Intensiv', 'Snabb 30 min', 'Auto']
const LIGHT_ZONES = ['Vardagsrum', 'Kök', 'Sovrum', 'Hall', 'Kontor', 'Badrum']

export function createInitialState(now = Date.now()) {
  return {
    simTime: now,
    lastTick: now,
    solar: {
      production: 0,
      todayKwh: 12.4,
      peakToday: 4.8,
    },
    battery: {
      charge: 64,
      capacity: 13.5,
      flow: 0,
    },
    grid: {
      consumption: 0,
    },
    washing: {
      status: 'running',
      program: 'Bomull 40°',
      tempC: 40,
      progress: 0.42,
      totalMinutes: 90,
    },
    dishwasher: {
      status: 'idle',
      program: 'Eco',
      progress: 0,
      totalMinutes: 120,
    },
    robot: {
      status: 'charging',
      battery: 78,
      room: 'Dockad',
      coveragePct: 0,
    },
    climate: {
      indoorC: 21.4,
      targetC: 21.5,
      humidity: 38,
      mode: 'idle',
      outdoorC: 8.2,
    },
    lighting: {
      zones: LIGHT_ZONES.map((name, i) => ({
        name,
        on: i < 3,
        brightness: i < 3 ? 70 + i * 5 : 0,
      })),
    },
  }
}

function solarOutput(hour) {
  // Bell-kurva ~ kl 6 till 20 med topp ca 12:30
  if (hour < 5.5 || hour > 20.5) return 0
  const peak = 13
  const span = 7
  const x = (hour - peak) / span
  const base = Math.max(0, Math.exp(-x * x * 2)) * 5200
  return Math.max(0, base + (Math.random() - 0.5) * 250)
}

function applianceLoad(state) {
  let load = 80 // baslast
  if (state.washing.status === 'running') {
    load += state.washing.tempC > 50 ? 2100 : 1100
  }
  if (state.dishwasher.status === 'running') {
    load += state.dishwasher.progress < 0.3 ? 1800 : 200
  }
  if (state.robot.status === 'cleaning') load += 35
  if (state.robot.status === 'charging' && state.robot.battery < 100) load += 25
  if (state.climate.mode === 'heating') load += 1400
  if (state.climate.mode === 'cooling') load += 900
  for (const z of state.lighting.zones) {
    if (z.on) load += 9 * (z.brightness / 100)
  }
  return load
}

export function tick(state, realDeltaMs) {
  const simDelta = realDeltaMs * SIM_SPEED
  const simTime = state.simTime + simDelta
  const date = new Date(simTime)
  const hour = date.getHours() + date.getMinutes() / 60

  // Sol
  const production = solarOutput(hour)
  const todayKwh =
    date.getHours() === 0 && date.getMinutes() < 2
      ? 0
      : state.solar.todayKwh + (production / 1000) * (simDelta / 3_600_000)
  const peakToday = Math.max(state.solar.peakToday, production / 1000)

  // Last
  const consumption = applianceLoad(state)
  const net = production - consumption

  // Batteri laddar från överskott, urladdar vid underskott
  const battEnergyKwh = (net / 1000) * (simDelta / 3_600_000)
  const battCapacity = state.battery.capacity
  let charge = state.battery.charge + (battEnergyKwh / battCapacity) * 100
  charge = Math.max(5, Math.min(100, charge))

  // Tvätt
  const washing = { ...state.washing }
  if (washing.status === 'running') {
    washing.progress += simDelta / (washing.totalMinutes * 60 * 1000)
    if (washing.progress >= 1) {
      washing.progress = 1
      washing.status = 'done'
    }
  }

  // Disk — startas slumpvis när inaktiv
  const dish = { ...state.dishwasher }
  if (dish.status === 'idle' && Math.random() < 0.0005) {
    dish.status = 'running'
    dish.progress = 0
    dish.program = DISH_PROGRAMS[Math.floor(Math.random() * DISH_PROGRAMS.length)]
  } else if (dish.status === 'running') {
    dish.progress += simDelta / (dish.totalMinutes * 60 * 1000)
    if (dish.progress >= 1) {
      dish.status = 'done'
      dish.progress = 1
    }
  }

  // Robot
  const robot = { ...state.robot }
  if (robot.status === 'charging') {
    robot.battery = Math.min(100, robot.battery + simDelta / 30000)
    robot.room = 'Dockad'
    if (robot.battery >= 100 && Math.random() < 0.003) {
      robot.status = 'cleaning'
      robot.coveragePct = 0
      robot.room = ROBOT_ROOMS[0]
    }
  } else if (robot.status === 'cleaning') {
    robot.battery = Math.max(0, robot.battery - simDelta / 25000)
    robot.coveragePct = Math.min(100, robot.coveragePct + simDelta / 18000)
    if (Math.random() < 0.02) {
      robot.room = ROBOT_ROOMS[Math.floor(Math.random() * ROBOT_ROOMS.length)]
    }
    if (robot.coveragePct >= 100 || robot.battery < 15) {
      robot.status = 'returning'
      robot.room = 'På väg hem'
    }
  } else if (robot.status === 'returning') {
    robot.battery = Math.max(0, robot.battery - simDelta / 40000)
    if (Math.random() < 0.01) {
      robot.status = 'charging'
      robot.room = 'Dockad'
    }
  }

  // Klimat
  const climate = { ...state.climate }
  const drift = (Math.random() - 0.5) * 0.05
  climate.indoorC = climate.indoorC + drift
  if (climate.indoorC < climate.targetC - 0.4) {
    climate.mode = 'heating'
    climate.indoorC += 0.02
  } else if (climate.indoorC > climate.targetC + 0.4) {
    climate.mode = 'cooling'
    climate.indoorC -= 0.02
  } else {
    climate.mode = 'idle'
  }
  climate.humidity = Math.max(30, Math.min(55, climate.humidity + (Math.random() - 0.5) * 0.3))
  climate.outdoorC = climate.outdoorC + (Math.random() - 0.5) * 0.05

  // Belysning — slumpvis dimring
  const lighting = {
    zones: state.lighting.zones.map((z) => {
      if (!z.on) return z
      const next = z.brightness + (Math.random() - 0.5) * 1.2
      return { ...z, brightness: Math.max(40, Math.min(100, next)) }
    }),
  }

  return {
    simTime,
    lastTick: state.lastTick + realDeltaMs,
    solar: { production, todayKwh, peakToday },
    battery: {
      charge,
      capacity: battCapacity,
      flow: net,
    },
    grid: { consumption },
    washing,
    dishwasher: dish,
    robot,
    climate,
    lighting,
  }
}

export const PROGRAMS = { WASH_PROGRAMS, DISH_PROGRAMS }
