"use client";

import * as React from "react";
import { Copy, CheckCircle, ExternalLink, Activity, Megaphone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // <-- ADICIONE ESTA LINHA

export default function MarketingAdminPage() {
  const [copiedFeed, setCopiedFeed] = React.useState(false);
  const feedUrl = "https://trendrushx.com/api/feeds/catalog";

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-brand-purple" /> Marketing & Ads
        </h1>
        <p className="text-sm text-muted mt-1">Gerencie Pixels, APIs de Conversão e Feeds de Catálogo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Feed de Catálogo XML */}
        <Card className="bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-lg text-brand-blue">Feeds Dinâmicos (XML)</CardTitle>
            <CardDescription>
              Conecte seu estoque automaticamente com o Google Merchant Center, Meta Commerce Manager e TikTok Catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-background border border-border rounded-lg space-y-3">
              <label className="text-xs font-bold text-muted uppercase">URL do Feed Master</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={feedUrl}
                  className="flex-1 bg-card border border-border/50 rounded-md px-3 text-sm text-white focus:outline-none"
                />
                <Button variant="outline" onClick={handleCopyFeed} className="px-4">
                  {copiedFeed ? <CheckCircle className="w-4 h-4 text-brand-green" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted">
                O XML é atualizado automaticamente sempre que há mudança de preço ou estoque.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button variant="secondary" className="w-full" asChild>
                <a 
				  href="https://merchants.google.com/" 
				  target="_blank" 
				  rel="noopener noreferrer"
				  className={buttonVariants({ variant: "secondary", className: "w-full inline-flex items-center justify-center" })}
				>
				  Google Merchant <ExternalLink className="w-3 h-3 ml-2" />
				</a>
              </Button>
              <Button variant="secondary" className="w-full" asChild>
                <a 
				  href="https://business.facebook.com/commerce" 
				  target="_blank" 
				  rel="noopener noreferrer"
				  className={buttonVariants({ variant: "secondary", className: "w-full inline-flex items-center justify-center" })}
				>
				  Meta Catalog <ExternalLink className="w-3 h-3 ml-2" />
				</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Status do Rastreamento */}
        <Card className="bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-lg text-brand-purple">Status de Rastreamento (CAPI & Pixels)</CardTitle>
            <CardDescription>
              Monitoramento dos sistemas de rastreamento Client-Side e Server-Side.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Meta Pixel + CAPI</span>
                    <span className="text-xs text-muted">ID: {process.env.NEXT_PUBLIC_META_PIXEL_ID || "Não configurado"}</span>
                  </div>
                </div>
                <Badge variant="success">Ativo e Deduzindo</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">TikTok Pixel</span>
                    <span className="text-xs text-muted">ID: {process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "Não configurado"}</span>
                  </div>
                </div>
                <Badge variant="success">Capturando ViewContent</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-brand-blue" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Google Tag Manager (GA4)</span>
                    <span className="text-xs text-muted">Aguardando Container GTM</span>
                  </div>
                </div>
                <Badge variant="outline">Standby</Badge>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}