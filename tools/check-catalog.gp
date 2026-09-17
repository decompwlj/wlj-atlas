\\ Compare published reference fixtures with regenerated CSVs.
\\ Run from root after generation: gp -fq tools/check-catalog.gp
default(parisizemax,512000000);
ids=["a000028", "a000037", "a000069", "a000093", "a000201", "a000378", "a000379", "a000469", "a000788", "a000961", "a000977", "a001043", "a001097", "a001358", "a001359", "a001481", "a001751", "a001952", "a001969", "a002476", "a002822", "a003052", "a003136", "a003277", "a003601", "a003628", "a003631", "a005100", "a005101", "a005349", "a005384", "a005385"];
checked=0;
{
 for(s=1,#ids,
  reference=readstr(Str("tools/fixtures/catalog/",ids[s],".csv"));
  computed=readstr(Str("raw/",ids[s],".csv"));
  if(#reference!=1001,error("Expected 1000 source fixture rows"));
  for(i=2,#reference,
   if(eval(Str("[",reference[i],"]"))!=eval(Str("[",computed[i],"]")),error(Str("Source mismatch ",ids[s]," row ",i-1)));
   checked++;
  );
 );
 print("PASS: ",checked," rows match original published CSV fixtures, all five fields.");
}
quit;
