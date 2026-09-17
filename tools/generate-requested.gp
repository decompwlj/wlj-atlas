\\ Run from the project root: gp -fq tools/generate-requested.gp
\\ raw/ must exist and contain no old CSV files (write appends).
\\ Reference kernel copied verbatim from decompwlj_fordiv.txt.
read("tools/kernel.gp");
default(parisizemax, 512000000);
TARGET = 200000;
{
  if(decomp(2,3)!=[0,0,1],error("unclassified kernel mismatch"));
  if(decomp(11,13)!=[3,3,2],error("tie kernel mismatch"));
  if(decomp(13,17)!=[9,1,4],error("kernel mismatch"));
}
export_seq(id, f, start=1) = {
  my(path=Str("raw/",id,".csv"), n=start, count=0, a, b, t);
  write(path,"n,a,k,L,d");
  while(count<TARGET,
    a=f(n); b=f(n+1);
    if(b<=a,error("Sequence must be strictly increasing"));
    t=decomp(a,b);
    write(path,Str(n,",",a,",",t[1],",",t[2],",",t[3]));
    if(t[1]>0,count++);
    n++;
  );
  print(id,": ",count," decomposable points; ",n-start," terms");
};

\\ Six requested OEIS sequences. Indices match the OEIS entries.
a001651(n)=floor((3*n-1)/2);
a001839(n)=floor(n*floor((n-1)/2)/3)-(n%6==5);
a001855(n)=if(n==1,0,my(m=#binary(n-1));n*m-2^m+1);
a006446(n)=my(q=(n-1)\3+1);q*(q+(n-1)%3);
export_seq("a001651",n->a001651(n));
\\ A001839 repeats 0 and 1; take its unmodified increasing tail from n=4.
export_seq("a001839",n->a001839(n),4);
export_seq("a001855",n->a001855(n));
\\ Generate palindromes directly by reflecting each leading half.
PAL=vector(TARGET+100); PAL[1]=0; j=2; len=1;
{
 while(j<=#PAL,
  h=(len+1)\2;
  for(seed=10^(h-1),10^h-1,
   v=seed; tail=if(len%2,seed\10,seed);
   for(t=1,len\2,v=10*v+tail%10;tail=tail\10);
   PAL[j]=v; j++; if(j>#PAL,break);
  );
  len++;
 );
}
export_seq("a002113",n->PAL[n]);
export_seq("a006446",n->a006446(n));
\\ Enumerate primes and test exact digit reversal; exclude palindromic primes.
EM=vector(TARGET+100); j=1; v=13;
{
 while(j<=#EM,
  rev=fromdigits(Vecrev(digits(v)));
  if(rev!=v && isprime(rev),EM[j]=v;j++);
  v=nextprime(v+1);
 );
}
export_seq("a006567",n->EM[n]);
quit;
