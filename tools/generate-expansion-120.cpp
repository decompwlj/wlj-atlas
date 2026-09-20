// Twenty-sequence expansion, 200,000 plotted points per sequence.
// Run from the project root; reference CSV directory is the sole argument.
#include <algorithm>
#include <cmath>
#include <cstdint>
#include <filesystem>
#include <fstream>
#include <functional>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>
using namespace std; using I=int64_t;
constexpr int BOUND=60000000,TARGET=200000;
vector<int> spf(BOUND+1), primes;
string refs;
void require(bool ok,string msg){if(!ok)throw runtime_error(msg);}
int digits(I n,int base=10){int s=0;for(;n;n/=base)s+=n%base;return s;}
vector<pair<I,int>> factor(I n){vector<pair<I,int>> f;
 if(n>BOUND){for(int p:primes){if(I(p)*p>n)break;if(n%p)continue;int e=0;do{n/=p;e++;}while(n%p==0);f.push_back({p,e});if(n<=BOUND)break;}}
 while(n>1){I p=n<=BOUND?spf[n]:n;int e=0;do{n/=p;e++;}while(n%p==0);f.push_back({p,e});}return f;
}
I weight(I a,I d){if(a<=2*d)return 0;auto f=factor(a-d);vector<I> ds{1};for(auto [p,e]:f){size_t n=ds.size();I power=1;for(int j=0;j<e;j++){power*=p;for(size_t i=0;i<n;i++)ds.push_back(ds[i]*power);}}I k=a-d;for(I v:ds)if(v>d)k=min(k,v);return k;}
I first(string id){ifstream in(refs+"/"+id+".csv");string s;while(getline(in,s)){replace(s.begin(),s.end(),';',',');stringstream ss(s);string n,a;getline(ss,n,',');getline(ss,a,',');if(!n.empty()&&all_of(n.begin(),n.end(),[](char c){return c>='0'&&c<='9';})&&!a.empty())return stoll(a);}throw runtime_error("No reference prefix: "+id);}
void output(string id,I a,function<I(I)> next){string path="raw/"+id+".csv";if(filesystem::exists(path)){ifstream check(path);string line;int points=0;while(getline(check,line)){replace(line.begin(),line.end(),',',' ');istringstream row(line);I n,a,k,L,d;if(row>>n>>a>>k>>L>>d)points+=k>0;}require(points==TARGET,"Incomplete existing dataset: "+path);cout<<id<<" already complete; preserved"<<endl;return;}ofstream out(path);out<<"n,a,k,L,d\n";int count=0,n=id=="a002620"?2:1;
 while(count<TARGET){I b=next(a);require(b>a,"Not increasing "+id);I d=b-a,k=weight(a,d),L=k?(a-d)/k:0;require(!k||(k>d&&k*L+d==a),"WLJ identity");out<<n++<<','<<a<<','<<k<<','<<L<<','<<d<<'\n';count+=k>0;a=b;}out.close();require(bool(out),"Write failed");cout<<id<<" "<<count<<" points, successor "<<a<<endl;
}
void matching(string id,function<bool(int)> pred){output(id,first(id),[=](I a)->I{for(int b=int(a)+1;b<=BOUND;b++)if(pred(b))return b;throw runtime_error("Bound exhausted "+id);});}
void fromVector(string id,vector<I> values){sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());I a=first(id);size_t at=lower_bound(values.begin(),values.end(),a)-values.begin();require(at<values.size()&&values[at]==a,"Missing first "+id);output(id,a,[&](I)->I{require(++at<values.size(),"Vector exhausted "+id);return values[at];});}
I sigma(int a){I s=1;for(auto [p,e]:factor(a)){I part=1,power=1;while(e--){power*=p;part+=power;}s*=part;}return s;}
int omega(int a,bool distinct=false){int s=0;for(auto [p,e]:factor(a))s+=distinct?1:e;return s;}
I powmod(I a,I e,I m){I s=1%m;while(e){if(e&1)s=s*a%m;a=a*a%m;e>>=1;}return s;}
I isqrt(I n){I x=sqrt((long double)n);while((x+1)*(x+1)<=n)x++;while(x*x>n)x--;return x;}
int main(){
 filesystem::create_directories("raw");
 for(int i=2;i<=BOUND;i++){if(!spf[i]){spf[i]=i;primes.push_back(i);}for(int p:primes){if(p>spf[i]||I(i)*p>BOUND)break;spf[i*p]=p;}}
 auto formula=[&](string id,function<I(I)> f,I start){I n=start;output(id,f(n),[&](I){return f(++n);});};
 formula("a000096",[](I n){return n*(n+3)/2;},1);
 formula("a000124",[](I n){return n*(n+1)/2+1;},1);
 formula("a000384",[](I n){return n*(2*n-1);},1);
 formula("a001844",[](I n){return 2*n*(n+1)+1;},1);
 formula("a002522",[](I n){return n*n+1;},1);
 formula("a002620",[](I n){return n*n/4;},2);
 formula("a003511",[](I n){return (n+isqrt(3*n*n))/2;},1);
 formula("a003512",[](I n){return 2*n+isqrt(3*n*n);},1);
 refs="tools/fixtures/expansion-120";
 matching("a002081",[](int a){int r=a%20;return r==2||r==4||r==8||r==16;});
 for(auto [id,pattern]:vector<pair<string,string>>{{"a003796","000"},{"a004742","101"},{"a004743","110"},{"a004744","011"},{"a004745","001"},{"a004746","010"}})
 matching(id,[=](int a){string bits;do{bits+=char('0'+a%2);a/=2;}while(a);reverse(bits.begin(),bits.end());return bits.find(pattern)==string::npos;});
 for(auto [id,m,r]:vector<tuple<string,int,int>>{{"a004611",3,1},{"a004613",4,1},{"a004614",4,3}})
 matching(id,[=](int a){for(auto [p,e]:factor(a))if(p%m!=r)return false;return true;});
 for(auto [id,takeFirst]:vector<pair<string,bool>>{{"a004201",true},{"a004202",false}}){vector<I> v;I a=1;for(I block=1;v.size()<210000;block++){for(int phase=0;phase<2;phase++)for(I j=0;j<block;j++,a++)if((phase==0)==takeFirst)v.push_back(a);}fromVector(id,v);}
}
