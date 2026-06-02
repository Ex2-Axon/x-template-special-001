import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Droplet, 
  Activity, 
  Thermometer, 
  ShieldAlert, 
  Zap, 
  Sliders, 
  Database, 
  RefreshCw, 
  Layers, 
  Radio, 
  Sparkles, 
  Atom, 
  FlaskConical, 
  Biohazard, 
  AlertTriangle,
  CheckCircle2,
  Eye,
  HeartPulse,
  Flame,
  Wind
} from 'lucide-react';

// --- โครงสร้างข้อมูลถังเพาะเลี้ยงชีวภาพ (Vessel Models) ---
interface BiotechVessel {
  id: string;
  name: string;
  strain: string;
  status: 'เสถียร' | 'กำลังกลายพันธุ์' | 'วิกฤต' | 'จำศีล';
  growthRate: number;      // อัตราการเติบโต %
  temperature: number;     // อุณหภูมิ °C
  ph: number;              // ค่าความเป็นกรด-ด่าง
  biomass: number;         // มวลชีวภาพ (g/L)
  bioluminescence: boolean;// สถานะการเรืองแสง
  toxicity: number;        // ระดับพิษ %
}

const initialVessels: BiotechVessel[] = [
  { id: 'BIO-01', name: 'แคปซูลไฮบริด อัลฟ่า', strain: 'Xenoflora-Phytoplankton 9X', status: 'เสถียร', growthRate: 68.4, temperature: 36.2, ph: 6.85, biomass: 720, bioluminescence: true, toxicity: 12 },
  { id: 'BIO-02', name: 'รังไหมสังเคราะห์ เบต้า', strain: 'Myco-Spliced NeuroSpore', status: 'กำลังกลายพันธุ์', growthRate: 94.2, temperature: 39.8, ph: 5.40, biomass: 1240, bioluminescence: true, toxicity: 68 },
  { id: 'BIO-03', name: 'ตู้น้ำเหลืองชีวภาพ แกมม่า', strain: 'Abyssal Annelid Symbiont', status: 'วิกฤต', growthRate: 12.8, temperature: 44.5, ph: 8.12, biomass: 310, bioluminescence: false, toxicity: 89 },
  { id: 'BIO-04', name: 'ระบบประสาทประดิษฐ์ เดลต้า', strain: 'Biolume Cyber-Medusa', status: 'จำศีล', growthRate: 1.5, temperature: 14.2, ph: 7.20, biomass: 85, bioluminescence: false, toxicity: 3 }
];

export default function App() {
  const [vessels, setVessels] = useState<BiotechVessel[]>(initialVessels);
  const [selectedVessel, setSelectedVessel] = useState<BiotechVessel>(initialVessels[0]);
  const [activeTab, setActiveTab] = useState<'monitor' | 'synth' | 'sequencer'>('monitor');
  const [pulseBeats, setPulseBeats] = useState<number[]>(Array(20).fill(40));
  const [pulseRate, setPulseRate] = useState<number>(75);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    '01:32:00 - ระบบความปลอดภัยชีวภาพพร้อมทำงานในโหมดสังเคราะห์สูงสุด',
    '01:32:05 - เชื่อมต่อแคปซูลอัลฟ่าสำเร็จ ตรวจพบสัญญาณคลื่นสมองชีวภาพ',
    '01:32:10 - คำเตือน: รังไหมเบต้ามีอัตราเร่งการกลายพันธุ์สูงผิดปกติ (+14%)'
  ]);

  // สเตทสำหรับแผงผสมสารเคมีชีวภาพ (Biotech Synthesizer)
  const [peptideRatio, setPeptideRatio] = useState<number>(50);
  const [mutagenLevel, setMutagenLevel] = useState<number>(30);
  const [incubationTemp, setIncubationTemp] = useState<number>(37);
  const [synthesizing, setSynthesizing] = useState<boolean>(false);
  const [synthProgress, setSynthProgress] = useState<number>(0);

  // สเตทสำหรับเครื่องจัดเรียงรหัสพันธุกรรม (Gene Splicer)
  const [codons, setCodons] = useState<string[]>(['ATG', 'GCT', 'TAC', 'CGT', 'AAA', 'TGA']);
  const [selectedCodonIndex, setSelectedCodonIndex] = useState<number | null>(null);

  // ระบบการอัปเดตแบบเรียลไทม์ (Simulated Biological Activity)
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. อัปเดตชีพจรชีวภาพ (Pulse Waveform Generator)
      setPulseRate(prev => {
        const target = selectedVessel.status === 'วิกฤต' ? 120 : selectedVessel.status === 'กำลังกลายพันธุ์' ? 95 : 70;
        const nextPulse = Math.floor(target + (Math.random() - 0.5) * 15);
        setPulseBeats(prevBeats => {
          const nextBeats = [...prevBeats.slice(1), nextPulse];
          return nextBeats;
        });
        return nextPulse;
      });

      // 2. อัปเดตตัวแปรสารชีวภาพในแต่ละถังเพาะเลี้ยง
      setVessels(prevVessels => 
        prevVessels.map(v => {
          if (v.status === 'จำศีล') return v;
          const tempShift = (Math.random() - 0.5) * 0.5;
          const phShift = (Math.random() - 0.5) * 0.08;
          const growthShift = v.status === 'กำลังกลายพันธุ์' ? Math.random() * 1.5 : (Math.random() - 0.5) * 0.8;
          
          return {
            ...v,
            temperature: parseFloat((v.temperature + tempShift).toFixed(1)),
            ph: parseFloat((v.ph + phShift).toFixed(2)),
            growthRate: Math.min(100, Math.max(0, parseFloat((v.growthRate + growthShift).toFixed(1)))),
            biomass: Math.max(50, Math.min(2000, v.biomass + Math.floor((Math.random() - 0.4) * 20)))
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [selectedVessel]);

  // ซิงค์ค่าการเลือกถังเมื่อข้อมูลเปลี่ยนไปแบบเรียลไทม์
  useEffect(() => {
    const freshData = vessels.find(v => v.id === selectedVessel.id);
    if (freshData) {
      setSelectedVessel(freshData);
    }
  }, [vessels]);

  // ฟังก์ชันเริ่มกระบวนการสังเคราะห์ยีนกลายพันธุ์ชีวภาพ
  const handleStartSynthesis = () => {
    if (synthesizing) return;
    setSynthesizing(true);
    setSynthProgress(0);
    
    setSystemLogs(prev => [
      `${new Date().toLocaleTimeString()} - เริ่มต้นกระบวนการเชื่อมสายเปปไทด์ดัดแปลงด้วยระดับสารกระตุ้น ${mutagenLevel}%`,
      ...prev
    ]);
  };

  useEffect(() => {
    if (!synthesizing) return;
    const interval = setInterval(() => {
      setSynthProgress(prev => {
        if (prev >= 100) {
          setSynthesizing(false);
          clearInterval(interval);
          
          // สุ่มผลลัพธ์การกระตุ้นถังเพาะเลี้ยงปัจจุบัน
          setVessels(allVessels => 
            allVessels.map(v => {
              if (v.id === selectedVessel.id) {
                const nextToxicity = Math.min(100, v.toxicity + Math.floor(mutagenLevel / 3));
                const nextStatus = nextToxicity > 75 ? 'วิกฤต' : nextToxicity > 40 ? 'กำลังกลายพันธุ์' : 'เสถียร';
                return {
                  ...v,
                  status: nextStatus,
                  growthRate: Math.min(100, v.growthRate + 15),
                  toxicity: nextToxicity,
                  bioluminescence: Math.random() > 0.3
                };
              }
              return v;
            })
          );

          setSystemLogs(prev => [
            `${new Date().toLocaleTimeString()} - สังเคราะห์สารเคมีสมบูรณ์แล้ว! ถัง ${selectedVessel.name} ได้รับการกระตุ้นและปรับตัวเรียบร้อย`,
            ...prev
          ]);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [synthesizing, mutagenLevel, selectedVessel]);

  // ฟังก์ชันดัดแปลงรหัสโคดอนพันธุกรรมแบบเรียลไทม์
  const mutateCodon = (index: number) => {
    const chemicalBases = ['ATG', 'GCT', 'TAC', 'CGT', 'AAA', 'TGA', 'CGG', 'TTA', 'ATT', 'GGG'];
    const currentCodon = codons[index];
    let nextCodon = chemicalBases[Math.floor(Math.random() * chemicalBases.length)];
    while (nextCodon === currentCodon) {
      nextCodon = chemicalBases[Math.floor(Math.random() * chemicalBases.length)];
    }

    const nextCodons = [...codons];
    nextCodons[index] = nextCodon;
    setCodons(nextCodons);

    setSystemLogs(prev => [
      `${new Date().toLocaleTimeString()} - ทำการตัดต่อรหัสโคดอนตำแหน่งที่ ${index + 1} เป็น [${nextCodon}]`,
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-[#020503] text-[#39ff14] font-mono selection:bg-[#d946ef] selection:text-black relative overflow-x-hidden p-3 sm:p-6 custom-scrollbar">
      
      {/* --- ชั้นเลเยอร์ตกแต่งธีม Biopunk (Bioluminescent Ambiance Layer) --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* แสงเรืองรองสีเขียวอมชมพูของเหลวอินทรีย์ */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] rounded-full bg-[#10b981]/15 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[60%] rounded-full bg-[#d946ef]/10 blur-[180px]" />
        <div className="absolute top-[35%] right-[15%] w-[300px] h-[300px] rounded-full bg-[#06b6d4]/5 blur-[120px]" />
        
        {/* เส้นใยตารางชีวภาพ (Biomimetic Grid Structure) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810b_1px,transparent_1px),linear-gradient(to_bottom,#10b9810b_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* --- โครงสร้างเนื้อหาหลัก --- */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* --- ส่วนหัวคอนโทรลเลอร์ (BIO-LAB TERMINAL HEADER) --- */}
        <header className="border-3 border-[#166534] bg-[#030905]/95 rounded-2xl p-4 md:p-6 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-[0_0_35px_rgba(57,255,20,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-[#d946ef] to-[#39ff14]" />
          
          <div className="flex items-center gap-5 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-[#39ff14] rounded-full animate-ping opacity-20" />
              <div className="bg-[#051108] border-2 border-[#39ff14] p-3 rounded-2xl text-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                <Biohazard className="w-10 h-10 animate-spin-slow text-[#10b981]" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black tracking-wider bg-gradient-to-r from-[#39ff14] via-[#10b981] to-[#d946ef] bg-clip-text text-transparent">
                  AXON-ORGANIC V.12
                </h1>
                <span className="text-[10px] bg-red-950/80 border border-red-500 text-red-400 px-2.5 py-0.5 rounded-full font-bold animate-pulse tracking-widest">
                  ระบบคุมวิกฤตชีวภาพ
                </span>
              </div>
              <p className="text-xs text-[#059669] mt-1 tracking-widest uppercase">
                แผงควบคุมหลัก • สัญญาณประสาทสังเคราะห์แบบสองทิศทาง
              </p>
            </div>
          </div>

          {/* สถิติชีพจรรวมของสถานีปฏิบัติการ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto text-xs">
            <div className="bg-[#021a0d] border border-[#16a34a]/60 p-3 rounded-xl flex items-center gap-3">
              <HeartPulse className="text-[#f43f5e] animate-pulse w-5 h-5" />
              <div>
                <span className="text-[9px] uppercase text-[#059669] block">ชีพจรคลื่นสมอง</span>
                <span className="font-bold text-white text-base">{pulseRate} <span className="text-[10px] text-rose-500">BPM</span></span>
              </div>
            </div>

            <div className="bg-[#021a0d] border border-[#16a34a]/60 p-3 rounded-xl flex items-center gap-3">
              <Activity className="text-[#06b6d4] w-5 h-5" />
              <div>
                <span className="text-[9px] uppercase text-[#059669] block">ความจุชีวภาพ</span>
                <span className="font-bold text-white text-base">84.2%</span>
              </div>
            </div>

            <div className="bg-[#021a0d] border border-[#16a34a]/60 p-3 rounded-xl flex items-center gap-3">
              <ShieldAlert className="text-[#eab308] w-5 h-5" />
              <div>
                <span className="text-[9px] uppercase text-[#059669] block">ระบบป้องกันเชื้อ</span>
                <span className="font-bold text-[#39ff14] text-sm tracking-widest">สมบูรณ์ (99%)</span>
              </div>
            </div>

            <div className="bg-[#021a0d] border border-[#16a34a]/60 p-3 rounded-xl flex items-center gap-3">
              <Radio className="text-[#d946ef] animate-pulse w-5 h-5" />
              <div>
                <span className="text-[9px] uppercase text-[#059669] block">การแพร่กระจาย</span>
                <span className="font-bold text-slate-300 text-sm">0.003% / ชม.</span>
              </div>
            </div>
          </div>
        </header>

        {/* --- แถบสลับหน้าควบคุมหลัก (ACTIVE CONTROLLER NAVIGATION) --- */}
        <div className="flex flex-wrap gap-2 border-b border-[#14532d] pb-1 z-10">
          <button 
            onClick={() => setActiveTab('monitor')}
            className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-t-xl transition-all duration-300 flex items-center gap-2 border-t-2 border-x-2 ${
              activeTab === 'monitor' 
                ? 'bg-[#091f11] text-[#39ff14] border-[#39ff14] shadow-[0_-4px_15px_rgba(57,255,20,0.15)]' 
                : 'border-transparent text-[#059669] hover:text-[#34d399]'
            }`}
          >
            <Layers className="w-4 h-4" /> ตรวจสอบสภาวะชีวภาพถังเพาะเลี้ยง
          </button>
          <button 
            onClick={() => setActiveTab('synth')}
            className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-t-xl transition-all duration-300 flex items-center gap-2 border-t-2 border-x-2 ${
              activeTab === 'synth' 
                ? 'bg-[#091f11] text-[#39ff14] border-[#39ff14] shadow-[0_-4px_15px_rgba(57,255,20,0.15)]' 
                : 'border-transparent text-[#059669] hover:text-[#34d399]'
            }`}
          >
            <FlaskConical className="w-4 h-4" /> สังเคราะห์สารเคมีเร่งการกลายพันธุ์
          </button>
          <button 
            onClick={() => setActiveTab('sequencer')}
            className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-t-xl transition-all duration-300 flex items-center gap-2 border-t-2 border-x-2 ${
              activeTab === 'sequencer' 
                ? 'bg-[#091f11] text-[#39ff14] border-[#39ff14] shadow-[0_-4px_15px_rgba(57,255,20,0.15)]' 
                : 'border-transparent text-[#059669] hover:text-[#34d399]'
            }`}
          >
            <Atom className="w-4 h-4" /> ตัดแต่งโคดอนสายรหัสพันธุกรรม
          </button>
        </div>

        {/* --- ตารางกริดหลักแบ่งแผงควบคุม (MAIN CONTROL LAYOUT GRID) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          
          {/* แผงด้านซ้าย: รายชื่อถังชีวภาพที่เชื่อมต่อ */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            
            {/* โครงสร้างรายการถังเพาะเลี้ยง */}
            <div className="border-2 border-[#166534] bg-[#030905]/95 rounded-2xl p-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#059669] flex items-center gap-2">
                  <Database className="w-4 h-4" /> รายการถังเพาะเลี้ยงชีวภาพ
                </h2>
                <span className="text-[10px] bg-[#14532d] text-[#a7f3d0] px-2 py-0.5 rounded font-bold font-mono">
                  ACTIVE_VESSEL_MATRIX
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {vessels.map((v) => {
                  const isSelected = v.id === selectedVessel.id;
                  let borderClass = 'border-[#14532d] bg-[#020704] hover:border-[#059669]';
                  let statusLabelClass = 'border-[#10b981] text-[#10b981] bg-[#064e3b]/30';

                  if (isSelected) {
                    borderClass = 'border-[#39ff14] bg-[#061c0d] shadow-[0_0_15px_rgba(57,255,20,0.25)]';
                  }

                  if (v.status === 'กำลังกลายพันธุ์') {
                    statusLabelClass = 'border-[#d946ef] text-[#d946ef] bg-[#701a75]/30';
                  } else if (v.status === 'วิกฤต') {
                    statusLabelClass = 'border-red-500 text-red-400 bg-red-950/30 animate-pulse';
                  } else if (v.status === 'จำศีล') {
                    statusLabelClass = 'border-[#64748b] text-[#94a3b8] bg-[#334155]/20';
                  }

                  return (
                    <div 
                      key={v.id}
                      onClick={() => setSelectedVessel(v)}
                      className={`cursor-pointer border-2 p-3.5 rounded-xl transition-all duration-300 flex items-center justify-between group ${borderClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg border ${
                          isSelected ? 'bg-[#39ff14] text-black border-transparent' : 'bg-[#051108] text-[#059669] border-[#14532d]'
                        }`}>
                          <Dna className={`w-5 h-5 ${v.status === 'กำลังกลายพันธุ์' ? 'animate-bounce' : ''}`} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-100 group-hover:text-[#39ff14] transition-colors">
                            {v.name}
                          </div>
                          <div className="text-[10px] text-[#059669] uppercase font-sans mt-0.5">
                            {v.strain}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${statusLabelClass}`}>
                          {v.status}
                        </span>
                        <div className="text-xs mt-1.5 font-bold text-slate-400">
                          {v.growthRate}% <span className="text-[9px] text-[#059669]">เติบโต</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* แผงล็อกข้อมูลประวัติสถานะระบบแบบเรียลไทม์ */}
            <div className="border-2 border-[#166534] bg-[#030905]/95 rounded-2xl p-4 shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#059669] mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#d946ef]" /> ประวัติกิจกรรมและภัยคุกคาม
              </h2>
              
              <div className="bg-black/85 rounded-xl p-3 h-[180px] overflow-y-auto border border-[#14532d] flex flex-col gap-2 custom-scrollbar font-mono text-[10px]">
                {systemLogs.map((log, index) => (
                  <div key={index} className="text-slate-300 border-b border-[#0f1f13] pb-1.5 last:border-0 leading-relaxed">
                    <span className="text-[#39ff14] font-bold">&gt;&gt;</span> {log}
                  </div>
                ))}
              </div>
              
              <div className="mt-3 flex justify-between items-center text-[9px] text-[#059669]">
                <span>ความหนาแน่นรังสีชีวภาพ: ต่ำ</span>
                <span className="flex items-center gap-1.5 animate-pulse text-[#39ff14] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#39ff14]" /> เครือข่ายทำงานปกติ
                </span>
              </div>
            </div>

          </div>

          {/* แผงตรงกลางและขวา: เนื้อหาฟังก์ชันการจำลองและการจัดการ */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* TAB 1: บอร์ดควบคุมสภาวะชีวภาพถังเพาะเลี้ยง (BIOLOGICAL MONITOR TAB) */}
            {activeTab === 'monitor' && (
              <>
                <div className="border-2 border-[#166534] bg-[#030905]/95 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
                  
                  {/* กรอบมุมตกแต่งเพื่อความไซเบอร์พังก์ */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-[#39ff14]" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-[#39ff14]" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-[#39ff14]" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-[#39ff14]" />

                  {/* แผงข้อมูลด่วนถังที่เลือก */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#14532d] pb-4 mb-5 gap-3">
                    <div>
                      <span className="text-xs text-[#059669] uppercase tracking-widest font-sans">
                        ถังเพาะเลี้ยงที่กำลังเชื่อมโยงคลื่นประสาท
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2 mt-0.5">
                        {selectedVessel.name} 
                        {selectedVessel.bioluminescence && (
                          <span className="text-[9px] bg-[#06b6d4]/20 border border-[#06b6d4] text-[#06b6d4] px-2 py-0.5 rounded font-mono animate-pulse">
                            เรืองแสงชีวภาพตื่นตัว
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#64748b] block">ประเภทสายพันธุ์</span>
                      <span className="text-sm font-bold text-[#eab308] font-mono">{selectedVessel.strain}</span>
                    </div>
                  </div>

                  {/* แผงเกจวัดค่าแบบอินเตอร์แอคทีฟ (Interactive Biomemetic Gauges) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    
                    {/* เกจ 1: อุณหภูมิเนื้อเยื่อ (CORE TEMP GAUGE) */}
                    <div className="bg-black/60 border border-[#14532d] rounded-2xl p-4 flex flex-col justify-between group hover:border-[#39ff14] transition-all duration-300">
                      <div className="flex justify-between items-center text-xs text-[#059669] mb-1 font-sans">
                        <span>อุณหภูมิแกนกลาง</span>
                        <Thermometer className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="my-2.5">
                        <span className="text-3xl font-black text-white tracking-tighter">
                          {selectedVessel.temperature}°C
                        </span>
                      </div>
                      <div className="w-full bg-[#051108] h-2.5 rounded-full overflow-hidden border border-[#14532d]">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 via-amber-400 to-red-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, (selectedVessel.temperature / 60) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-[#047857] mt-2">
                        <span>ขีดจำกัดแช่แข็ง: 10°C</span>
                        <span>วิกฤตร้อนจัด: 45°C</span>
                      </div>
                    </div>

                    {/* เกจ 2: ความเป็นกรด-ด่างของน้ำเลี้ยง (PH ACIDITY GAUGE) */}
                    <div className="bg-black/60 border border-[#14532d] rounded-2xl p-4 flex flex-col justify-between group hover:border-[#39ff14] transition-all duration-300">
                      <div className="flex justify-between items-center text-xs text-[#059669] mb-1 font-sans">
                        <span>ค่าความเป็นกรด-ด่าง</span>
                        <Droplet className="w-4 h-4 text-sky-400" />
                      </div>
                      <div className="my-2.5">
                        <span className="text-3xl font-black text-white tracking-tighter">
                          {selectedVessel.ph}
                        </span>
                      </div>
                      <div className="w-full bg-[#051108] h-2.5 rounded-full overflow-hidden border border-[#14532d]">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 via-[#39ff14] to-violet-600 transition-all duration-500"
                          style={{ width: `${(selectedVessel.ph / 14) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-[#047857] mt-2">
                        <span>กรดสูง (pH 3)</span>
                        <span>ด่างสูง (pH 11)</span>
                      </div>
                    </div>

                    {/* เกจ 3: ระดับพิษสะสมในเนื้อเยื่อ (TOXICITY GAUGE) */}
                    <div className="bg-black/60 border border-[#14532d] rounded-2xl p-4 flex flex-col justify-between group hover:border-[#39ff14] transition-all duration-300">
                      <div className="flex justify-between items-center text-xs text-[#059669] mb-1 font-sans">
                        <span>ระดับความเป็นพิษสะสม</span>
                        <AlertTriangle className="w-4 h-4 text-[#d946ef]" />
                      </div>
                      <div className="my-2.5">
                        <span className="text-3xl font-black text-white tracking-tighter">
                          {selectedVessel.toxicity}%
                        </span>
                      </div>
                      <div className="w-full bg-[#051108] h-2.5 rounded-full overflow-hidden border border-[#14532d]">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-fuchsia-600 transition-all duration-500"
                          style={{ width: `${selectedVessel.toxicity}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-[#047857] mt-2">
                        <span>ปกติ</span>
                        <span className="text-[#d946ef] font-bold animate-pulse">กลายพันธุ์ฉับพลัน &gt; 70%</span>
                      </div>
                    </div>

                  </div>

                  {/* แผงวิเคราะห์คลื่นคลื่นประสาทและสัญญาณชีพจรชีวภาพ */}
                  <div className="bg-black/90 border-2 border-[#14532d] rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.06)_0%,transparent_75%)] pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-4 text-xs font-bold text-emerald-400">
                      <span className="flex items-center gap-2">
                        <HeartPulse className="w-4 h-4 text-[#39ff14] animate-pulse" />
                        กราฟวิเคราะห์คลื่นประสาทสะท้อนกลับ (Neuro-Sync Pulse Waveform)
                      </span>
                      <span className="text-[10px] text-[#64748b]">โหมด: ถ่ายทอดความถี่สด</span>
                    </div>

                    {/* หน้าจอแสดงผลแบบไซไฟอินเตอร์แอคทีฟ */}
                    <div className="h-28 flex items-end justify-between gap-1 w-full p-2 bg-[#020704] rounded-xl border border-[#14532d] relative">
                      {pulseBeats.map((val, idx) => (
                        <div 
                          key={idx}
                          className={`w-full rounded-t transition-all duration-300 ${
                            selectedVessel.status === 'วิกฤต' ? 'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-[#39ff14]/80 shadow-[0_0_8px_rgba(57,255,20,0.5)]'
                          }`}
                          style={{ height: `${(val / 160) * 100}%` }}
                        />
                      ))}
                      
                      <div className="absolute top-2 left-3 text-[9px] text-emerald-600 font-mono">
                        รหัสเชื่อมประสาท: {selectedVessel.id}_A_WAVE<br />
                        ความหน่วงเวลาตอบสนอง: 42ms<br />
                        ความถี่อ้างอิง: SPLICED_HZ
                      </div>
                    </div>

                    {/* รายละเอียดมวลชีวภาพ (Biomass details) */}
                    <div className="flex flex-wrap justify-between items-center mt-4 text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-[#64748b] block text-[10px]">ความหนาแน่นของเซลล์</span>
                          <span className="font-bold text-slate-200">{selectedVessel.biomass} g/L</span>
                        </div>
                        <div>
                          <span className="text-[#64748b] block text-[10px]">อัตราเร่งการโต</span>
                          <span className="font-bold text-[#39ff14]">{selectedVessel.growthRate}% / วัน</span>
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 bg-[#051108] px-3 py-1.5 rounded-lg border border-[#14532d]">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        ความตึงเครียดของเหลว: {selectedVessel.status === 'วิกฤต' ? 'สูงมาก' : 'ปกติ'}
                      </div>
                    </div>

                  </div>

                </div>

                {/* แผงควบคุมระบบระบายภัยพิบัติฉุกเฉิน (Emergency Purge & Stabilizers) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#021006] to-[#041a0b] border-2 border-[#166534] rounded-2xl p-4 shadow-md flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#39ff14] mb-2.5 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400 animate-pulse" /> ระบบควบคุมสารอาหารโปรตีนเหลว
                      </h4>
                      <p className="text-xs text-emerald-600/90 leading-relaxed mb-4">
                        ฉีดกรดอะมิโนจำเพาะเพื่อปรับสภาพและฟื้นฟูเซลล์ที่เริ่มเสื่อมสภาพ ป้องกันโอกาสการหลุดการเชื่อมต่อของระบบรักษาสมดุล
                      </p>
                    </div>
                    <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-[#14532d]">
                      <span className="text-xs font-bold text-slate-200">ปริมาณสารตั้งต้นเลี้ยงชีวิต</span>
                      <button 
                        onClick={() => {
                          setVessels(prev => prev.map(v => v.id === selectedVessel.id ? { ...v, toxicity: Math.max(0, v.toxicity - 15), status: 'เสถียร' } : v));
                          setSystemLogs(prev => [`${new Date().toLocaleTimeString()} - ได้รับสารโปรตีนหล่อเลี้ยงเซลล์: ล้างพิษให้กับ ${selectedVessel.name}`, ...prev]);
                        }}
                        className="text-xs px-3.5 py-1.5 rounded-lg bg-[#0c2f16] text-[#39ff14] border border-[#39ff14] font-bold hover:bg-[#39ff14] hover:text-black transition-all"
                      >
                        ฉีดสารเลี้ยงเซลล์ (-15% พิษ)
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#021006] to-[#1a0414] border-2 border-[#166534] rounded-2xl p-4 shadow-md flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 mb-2.5 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" /> ระบบแช่แข็งทำลายล้างฉุกเฉิน (Cryo-Purge)
                      </h4>
                      <p className="text-xs text-emerald-600/90 leading-relaxed mb-4">
                        กรณีเกิดการกลายพันธุ์ที่คุมไม่ได้ ระบบจะปล่อยไนโตรเจนเหลวความเย็นยิ่งยวดเพื่อลดอุณหภูมิลงเป็น 0°C ทันที ป้องกันการแพร่เชื้อ
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setVessels(prev => prev.map(v => v.id === selectedVessel.id ? { ...v, status: 'จำศีล', growthRate: 0, temperature: 0, toxicity: 0 } : v));
                        setSystemLogs(prev => [`${new Date().toLocaleTimeString()} - ล้างระบบฉุกเฉินสำเร็จ! แคปซูล ${selectedVessel.name} เข้าสู่สภาวะแช่แข็งจำศีลถาวร`, ...prev]);
                      }}
                      className="w-full bg-gradient-to-r from-rose-950/60 to-red-900/80 border border-red-500 text-red-200 text-xs py-3 rounded-xl font-bold uppercase tracking-widest hover:from-red-900 hover:to-rose-950 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    >
                      กระตุ้นระบบแช่แข็งจำศีลฉุกเฉิน
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: เครื่องสังเคราะห์สารเคมีเร่งการกลายพันธุ์ (BIOTECH SYNTHESIZER TAB) */}
            {activeTab === 'synth' && (
              <div className="border-2 border-[#166534] bg-[#030905]/95 rounded-2xl p-5 md:p-6 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-[#14532d] pb-4 mb-5">
                  <div className="p-2.5 bg-[#701a75]/30 border border-[#d946ef] text-[#d946ef] rounded-xl">
                    <FlaskConical className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 uppercase">เครื่องสังเคราะห์สารโปรตีนชีวภาพดัดแปลง</h3>
                    <p className="text-xs text-[#059669]">สกัดและรวมส่วนผสมทางพันธุกรรมเพื่อเร่งวิวัฒนาการในเซลล์เป้าหมาย</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                  
                  {/* แผงปรับตั้งค่าอัตราสารเคมี */}
                  <div className="bg-black/60 border border-[#14532d] p-5 rounded-2xl flex flex-col gap-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#39ff14]">สูตรผสมตัวทำปฏิกิริยา</h4>
                    
                    {/* เปปไทด์ตั้งต้น */}
                    <div>
                      <div className="flex justify-between text-xs text-[#059669] mb-1.5 uppercase font-bold">
                        <span>สัดส่วนสายเปปไทด์ตั้งต้น (Peptide Linker)</span>
                        <span className="text-[#39ff14]">{peptideRatio}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={peptideRatio}
                        onChange={(e) => setPeptideRatio(Number(e.target.value))}
                        className="w-full accent-[#39ff14] bg-[#051108] h-1.5 rounded-lg appearance-none cursor-pointer border border-[#14532d]"
                      />
                    </div>

                    {/* ความเข้มข้นสารเร่งการกลายพันธุ์ */}
                    <div>
                      <div className="flex justify-between text-xs text-[#059669] mb-1.5 uppercase font-bold">
                        <span>ความเข้มข้นสารเร่งกลายพันธุ์ (Mutagen Index)</span>
                        <span className="text-[#d946ef]">{mutagenLevel}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={mutagenLevel}
                        onChange={(e) => setMutagenLevel(Number(e.target.value))}
                        className="w-full accent-[#d946ef] bg-[#051108] h-1.5 rounded-lg appearance-none cursor-pointer border border-[#14532d]"
                      />
                    </div>

                    {/* การควบคุมอุณหภูมิเตาอบเลี้ยงชีวภาพ */}
                    <div>
                      <span className="text-xs text-[#059669] block mb-2 uppercase font-bold">ตั้งอุณหภูมิถังบ่มปฏิกิริยา (Incubation Temperature)</span>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[25, 37, 45].map((temp) => (
                          <button
                            key={temp}
                            onClick={() => setIncubationTemp(temp)}
                            className={`py-2 text-xs rounded-xl font-bold border transition-all ${
                              incubationTemp === temp 
                                ? 'bg-[#10b981] text-black border-transparent shadow-[0_0_10px_rgba(16,185,129,0.35)]' 
                                : 'bg-[#020704] text-emerald-500 border-[#14532d] hover:border-[#39ff14]'
                            }`}
                          >
                            {temp === 25 ? 'เย็นตัว (25°C)' : temp === 37 ? 'สมดุล (37°C)' : 'เร่งรัด (45°C)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={handleStartSynthesis}
                        disabled={synthesizing}
                        className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          synthesizing 
                            ? 'bg-[#14532d] text-emerald-600 cursor-not-allowed border border-[#10b981]/30' 
                            : 'bg-gradient-to-r from-[#39ff14] via-[#10b981] to-[#d946ef] text-black hover:scale-[1.01] shadow-[0_0_25px_rgba(217,70,239,0.4)]'
                        }`}
                      >
                        {synthesizing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> กำลังจัดเรียงโมเลกุลในระบบปิด...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" /> เริ่มต้นการผสมสารเคมีเร่งตัวอ่อน
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  {/* แผงแสดงผลสถานะการทำงานหลอดทดลองจำลอง */}
                  <div className="bg-black/60 border border-[#14532d] p-5 rounded-2xl flex flex-col justify-between items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 text-[9px] text-[#059669]">
                      รหัสเตาบ่ม: CH-B12
                    </div>

                    <div className="w-full text-left text-xs text-[#059669] uppercase font-bold tracking-widest">
                      ระดับการบ่มเพาะและจัดระเบียบสารเคมี
                    </div>

                    <div className="relative my-6 flex items-center justify-center">
                      <div className="w-36 h-36 rounded-full border-4 border-dashed border-[#14532d] flex flex-col items-center justify-center relative p-3">
                        <span className="text-4xl font-black text-white tracking-tight">
                          {synthProgress}%
                        </span>
                        <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-sans mt-1">
                          {synthesizing ? 'อยู่ระหว่างสกัด' : 'สแตนด์บาย'}
                        </span>

                        {/* เอฟเฟกต์การหมุนวนรอบๆ เกจวงกลม */}
                        <div 
                          className="absolute inset-[-4px] rounded-full border-4 border-[#d946ef] transition-all duration-150"
                          style={{ 
                            opacity: synthesizing ? 1 : 0.15, 
                            transform: `rotate(${synthProgress * 3.6}deg)`,
                            borderStyle: 'solid none solid none'
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-full bg-[#020704] border border-[#14532d] rounded-xl p-3 text-[11px] text-emerald-400 font-mono">
                      {synthesizing ? (
                        <span className="animate-pulse text-[#d946ef] font-bold">
                          คำเตือน: ความดันห้องปฏิกรณ์เพิ่มขึ้นในระดับอันตราย...
                        </span>
                      ) : (
                        <span>เตาบ่มชีวภาพหลัก: อยู่ในภาวะควบคุมปลอดภัย</span>
                      )}
                    </div>

                  </div>

                </div>

                {/* ตารางแสดงผลลัพธ์สารที่ได้ */}
                <div className="bg-[#020704] border border-[#14532d] p-4 rounded-xl text-xs">
                  <div className="text-[#059669] uppercase font-bold tracking-wider mb-2">องค์ประกอบทางเคมีวิเคราะห์ย้อนกลับ</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="p-2.5 bg-[#051108] border border-[#14532d] rounded-lg">
                      <span className="text-purple-400 block font-bold text-sm">34.5%</span> อะมิโนจำลอง (Synth-Amino)
                    </div>
                    <div className="p-2.5 bg-[#051108] border border-[#14532d] rounded-lg">
                      <span className="text-cyan-400 block font-bold text-sm">18.2%</span> สารเรืองแสงเรดอน (Radon Lume)
                    </div>
                    <div className="p-2.5 bg-[#051108] border border-[#14532d] rounded-lg">
                      <span className="text-emerald-400 block font-bold text-sm">42.0%</span> ตัวเร่งวิวัฒนาการเซลล์
                    </div>
                    <div className="p-2.5 bg-[#051108] border border-[#14532d] rounded-lg">
                      <span className="text-amber-400 block font-bold text-sm">5.3%</span> สารเสถียรกรดด่าง
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: เครื่องจัดเรียงรหัสพันธุกรรม (GENE SPLICER & SEQUENCER TAB) */}
            {activeTab === 'sequencer' && (
              <div className="border-2 border-[#166534] bg-[#030905]/95 rounded-2xl p-5 md:p-6 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-[#14532d] pb-4 mb-5">
                  <div className="p-2.5 bg-[#0284c7]/30 border border-[#0284c7] text-[#0284c7] rounded-xl">
                    <Atom className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 uppercase">แท่นดัดแปลงสายพันธุ์ลำดับโคดอนพันธุกรรม</h3>
                    <p className="text-xs text-[#059669]">คลิกที่สายเบสคู่สมเพื่อทำการตัดต่อยีนและปรับปรุงประสิทธิภาพการต่อต้านสารพิษ</p>
                  </div>
                </div>

                <div className="bg-black/60 border border-[#14532d] rounded-2xl p-4 md:p-5 my-4">
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <div>
                      <span className="text-xs text-emerald-400 font-bold block uppercase tracking-wide">
                        สายรหัสเบสพันธุกรรมหลัก (DNA Sequence String)
                      </span>
                      <p className="text-[10px] text-[#059669] mt-0.5">
                        เป้าหมายถังปัจจุบัน: <span className="text-[#39ff14] font-bold">{selectedVessel.name}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCodons(Array(6).fill(null).map(() => {
                          const chemicalBases = ['ATG', 'GCT', 'TAC', 'CGT', 'AAA', 'TGA', 'CGG', 'TTA', 'ATT', 'GGG'];
                          return chemicalBases[Math.floor(Math.random() * chemicalBases.length)];
                        }));
                        setSystemLogs(prev => [`${new Date().toLocaleTimeString()} - ล้างและสร้างรหัสพันธุกรรมแบบสุ่มใหม่`, ...prev]);
                      }}
                      className="px-3 py-1.5 bg-[#0c2f16] text-[#39ff14] border border-[#39ff14] rounded-lg text-xs font-bold hover:bg-[#39ff14] hover:text-black transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> สุ่มสับเปลี่ยนยีนใหม่
                    </button>
                  </div>

                  {/* ลำดับรหัสเบส */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 my-5">
                    {codons.map((codon, index) => (
                      <div 
                        key={index}
                        onClick={() => mutateCodon(index)}
                        className="cursor-pointer bg-[#020704] border-2 border-[#166534] p-3.5 rounded-xl text-center shadow-inner relative group hover:border-[#d946ef] hover:scale-105 transition-all duration-300"
                      >
                        <div className="absolute top-1 right-1.5 text-[8px] text-[#059669]">
                          #0{index + 1}
                        </div>
                        <div className="text-lg font-black tracking-widest text-[#39ff14] font-mono mt-1 group-hover:text-[#d946ef]">
                          {codon}
                        </div>
                        <div className="text-[9px] text-[#059669] font-sans mt-1">
                          คลิกเพื่อตัดต่อ
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-[#020704] border border-dashed border-[#14532d] rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-200 block">วิเคราะห์โครงสร้างเซลล์พืชดัดแปลงพันธุกรรม</span>
                      <p className="text-[11px] text-[#059669] mt-0.5">
                        การตัดต่อรหัสเบสเหล่านี้จะส่งผลทันทีต่อระดับความมีชีวิตชีวาและการต้านพิษสะสมของสิ่งมีชีวิต
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setVessels(prev => prev.map(v => v.id === selectedVessel.id ? { ...v, growthRate: Math.min(100, v.growthRate + 12), toxicity: Math.max(0, v.toxicity - 10) } : v));
                        setSystemLogs(prev => [`${new Date().toLocaleTimeString()} - บันทึกและฉีดโครงสร้างสายยีนชุดใหม่เข้าระบบสำเร็จ`, ...prev]);
                        alert('ฉีดโครงสร้างรหัสยีนชุดใหม่เข้าระบบเรียบร้อยแล้ว!');
                      }}
                      className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-4 py-2.5 rounded-xl font-bold hover:brightness-115 transition-all uppercase tracking-wider text-[11px] w-full md:w-auto text-center"
                    >
                      เขียนรหัสลงนิวเคลียสแคปซูล
                    </button>
                  </div>

                </div>

                {/* คำเตือนความปลอดภัยของยีนโฮโลแกรม */}
                <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 flex items-start gap-3.5 text-xs text-amber-300">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase block text-amber-400">คำแนะนำในการควบคุมด้านสัตวศาสตร์และพันธุศาสตร์</span>
                    การแก้ไขรหัส ‘TGA’ ในลำดับห้ามสุ่มหรือเว้นว่างมากเกินไป เนื่องจากเป็นคำสั่งรหัสปิดสายเปปไทด์ (Stop Codon) หากถูกตัดสลับอาจทำให้เซลล์มะเร็งภายในแคปซูลเจริญเติบโตจนล้นภาชนะควบคุมได้
                  </div>
                </div>

              </div>
            )}

            {/* แถบส่วนท้าย: สรุปสถานการณ์ระบบเชื่อมต่อ */}
            <div className="border-2 border-[#166534] bg-[#030905]/95 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase text-[#059669] font-mono">
              <div className="flex items-center gap-4 flex-wrap">
                <span>เซสชันผู้ใช้อ้างอิง: <span className="text-slate-300">LAB-ADMIN-A9</span></span>
                <span className="hidden sm:inline">|</span>
                <span>ระดับความเสถียรภาพเครือข่ายชีวภาพ: <span className="text-[#39ff14] font-bold">ยอดเยี่ยม</span></span>
              </div>
              <div className="text-center sm:text-right">
                © พัฒนาโดย AXON UI GENERATOR FRAMEWORK 2026
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}