import React from 'react';
import { useState, useEffect } from 'react';
import { requestPrint } from './bxlcommon.js';
import { useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
//{ partNo, partName, lotCode, receivingDate, vendor, mfgDate, original }
const usePrintBIXOLON = () => {
  const issueID = useRef(0);
  const label_data = useRef({ id: 0, functions: {} });
  const label_func = useRef({});
  const incLabelNum = useRef(0);
  function setLabelId(setId) {
    label_data.current.id = setId;
  }
  function clearBuffer() {
    const _a = { clearBuffer: [] };
    label_func.current['func' + incLabelNum.current] = _a;
    incLabelNum.current++;
  }
  function directDrawText(text) {
    const _a = { directDrawText: [text] };
    label_func.current['func' + incLabelNum.current] = _a;
    incLabelNum.current++;
  }
  function printBuffer() {
    const _a = { printBuffer: [] };
    label_func.current['func' + incLabelNum.current] = _a;
    incLabelNum.current++;
  }
  function getLabelData() {
    label_data.current.functions = label_func.current;
    label_func.current = {};
    incLabelNum.current = 0;

    return JSON.stringify(label_data.current);
  }

  async function handlePrint({ detail }) {
    setLabelId(issueID.current);
    clearBuffer();
    directDrawText('SM0,0');
    directDrawText('STd');
    directDrawText('SF1');
    directDrawText('SA0');
    directDrawText('TA0');
    directDrawText('SL400,24,G');
    directDrawText('SOT');
    directDrawText('SW799');
    directDrawText('CUTn');
    for (let i = 0; i < detail.length; i++) {
      PrintLabel(detail[i]);
      if (i < detail.length - 1) {
        directDrawText('P1,1');
      }
    }
    printBuffer();
    const strSubmit = getLabelData();
    issueID.current++;
    requestPrint('Printer1', strSubmit, (result) => {
      let success = result.split(':')[1];
      if (success == 'success') console.log('OK');
    });
  }

  const PrintLabel = (pathName) => {
    directDrawText("V51,47,U,23,23,0,N,N,N,0,L,0,'Part No'");
    directDrawText(`B1199,36,1,3,9,45,0,0,'${pathName}'`);
    directDrawText(`V258,6,U,23,23,0,N,N,N,0,L,0,'${pathName}'`);
    directDrawText("V51,93,U,23,23,0,N,N,N,0,L,0,'Part name'");
    directDrawText("V205,89,U,23,23,0,N,N,N,0,L,0,'A/D Converter IC;12P,PLASTIC,5.61x9.0MM MINSOP'");
    directDrawText("V51,140,U,23,23,0,N,N,N,0,L,0,'Q'ty'");
    directDrawText("V205,142,U,23,23,0,N,N,N,0,L,0,'2000'");
    directDrawText("V51,190,U,23,23,0,N,N,N,0,L,0,'Lot Code'");
    directDrawText("V203,190,U,23,23,0,N,N,N,0,L,0,'1002A0200051_230310_ABC_XXXX'");
    directDrawText("V51,237,U,23,23,0,N,N,N,0,L,0,'Receiving Date'");
    directDrawText("V235,239,U,23,23,0,N,N,N,0,L,0,'2023-03-01'");
    directDrawText("V51,279,U,23,23,0,N,N,N,0,L,0,'VENDOR'");
    directDrawText("V209,281,U,23,23,0,N,N,N,0,L,0,'Power Integrations InterNation Ltd'");
    directDrawText("V51,317,U,23,23,0,N,N,N,0,L,0,'MFG Date'");
    directDrawText("V209,317,U,23,23,0,N,N,N,0,L,0,'2023-03-15'");
    directDrawText("V51,353,U,23,23,0,N,N,N,0,L,0,'Original'");
    directDrawText("V211,351,U,23,23,0,N,N,N,0,L,0,'ThaiLand'");
    directDrawText("B2670,273,Q,2,M,5,0,'1234567890'");
  };

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('printBIXILON', handlePrint);
    return () => {
      listener.remove();
    };
  }, []);
  return null;
};
export default usePrintBIXOLON;
