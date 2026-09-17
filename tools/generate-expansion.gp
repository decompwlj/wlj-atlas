\\ Ten catalogue additions, September 2026. Run from project root.
\\ mkdir -p raw; gp -fq tools/generate-expansion.gp
\\ Each file includes consecutive terms through 200,000 classified points.
read("tools/kernel.gp");
default(parisizemax,512000000);
TARGET=200000;
assert_missing(path)={iferr(readstr(path),E,return(1));error(Str("Refusing to append to existing ",path))};
export_step(id,a,next)={
 my(path=Str("raw/",id,".csv"),n=1,count=0,b,t);
 assert_missing(path);assert_missing(Str(path,".tmp"));write(Str(path,".tmp"),"n,a,k,L,d");
 while(count<TARGET,
  b=next(a);
  if(b<=a || b>9007199254740991,error("Increasing safe integer required"));
  t=decomp(a,b);write(Str(path,".tmp"),Str(n,",",a,",",t[1],",",t[2],",",t[3]));
  if(t[1]>0,count++);n++;a=b;
 );
 system(Str("mv -- ",path,".tmp ",path));
 print(id,": ",count," decomposable points; ",n-1," terms");
};
EXPANSION_IDS=["a003726", "a004215", "a005153", "a006093", "a006450", "a006512", "a006753", "a006995", "a007510", "a007770"];
iferr(for(i=1,#EXPANSION_IDS,assert_missing(Str("raw/",EXPANSION_IDS[i],".csv"))),E,print(E);quit(1));
next_match(a,pred)={my(b=a+1);while(!pred(b),b++);b};
export_pred(id,a,pred)=export_step(id,a,x->next_match(x,pred));
export_vector(id,V)={
 my(path=Str("raw/",id,".csv"),n=1,count=0,a,b,t);
 assert_missing(path);assert_missing(Str(path,".tmp"));write(Str(path,".tmp"),"n,a,k,L,d");
 while(count<TARGET,
  if(n+1>#V,error("Increase vector bound"));a=V[n];b=V[n+1];
  if(b<=a || b>9007199254740991,error("Increasing safe integer required"));
  t=decomp(a,b);write(Str(path,".tmp"),Str(n,",",a,",",t[1],",",t[2],",",t[3]));
  if(t[1]>0,count++);n++;
 );
 system(Str("mv -- ",path,".tmp ",path));
 print(id,": ",count," decomposable points; ",n-1," terms");
};
next_prime_match(a,pred)={my(p=nextprime(a+1));while(!pred(p),p=nextprime(p+1));p};
export_primes(id,a,pred)=export_step(id,a,p->next_prime_match(p,pred));
no111(v)=bitand(bitand(v,v\2),v\4)==0;
four_squares(v)={while(v%4==0,v=v/4);v%8==7};
practical(v)={
 if(v==1,return(1));if(v%2,return(0));
 my(F=factor(v),s=1,p,e);
 for(i=1,matsize(F)[1],p=F[i,1];e=F[i,2];if(p>s+1,return(0));s*=(p^(e+1)-1)/(p-1));1
};
smith(v)={
 my(F=factor(v));
 if(matsize(F)[1]==1 && F[1,2]==1,return(0));
 sumdigits(v)==sum(i=1,matsize(F)[1],F[i,2]*sumdigits(F[i,1]))
};
digit_squares(v)={my(s=0);while(v,s+=(v%10)^2;v=v\10);s};
happy(v)={while(v!=1 && v!=4,v=digit_squares(v));v==1};
export_pred("a003726",0,v->no111(v));
export_pred("a004215",7,v->four_squares(v));
export_pred("a005153",1,v->practical(v));
export_step("a006093",1,x->nextprime(x+2)-1);
PP=primes(TARGET+100);PQ=primes(PP[#PP]);
export_vector("a006450",vector(#PP,i,PQ[PP[i]]));
PQ=0;PP=0;
export_primes("a006512",5,p->isprime(p-2));
export_pred("a006753",4,v->smith(v));
\\ Generate binary palindromes in order by reflecting each leading half.
PAL=vector(TARGET+100);PAL[1]=0;j=2;len=1;
{
 while(j<=#PAL,
  h=(len+1)\2;
  for(seed=2^(h-1),2^h-1,
   v=seed;tail=if(len%2,seed\2,seed);
   for(t=1,len\2,v=2*v+tail%2;tail=tail\2);
   PAL[j]=v;j++;if(j>#PAL,break);
  );
  len++;
 );
}
export_vector("a006995",PAL);PAL=0;
export_primes("a007510",2,p->!isprime(p-2) && !isprime(p+2));
\\ A safe integer has at most 16 decimal digits; one step is at most 16*81.
HAPPY_TABLE=vector(16*81+1,i,if(i==1,0,happy(i-1)));
export_pred("a007770",1,v->HAPPY_TABLE[digit_squares(v)+1]);
